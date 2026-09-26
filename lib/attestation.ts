import {AppError,canonical,digest} from './domain';

export const attestationPurpose='Application export signature; not an institutional or clinical certification.';
export function base64(bytes:Uint8Array){let s='';for(let i=0;i<bytes.length;i+=8192)s+=String.fromCharCode(...bytes.subarray(i,i+8192));return btoa(s)}
export function unbase64(text:string){return Uint8Array.from(atob(text),c=>c.charCodeAt(0))}
export async function byteHash(bytes:Uint8Array){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes as BufferSource))].map(v=>v.toString(16).padStart(2,'0')).join('')}
export function publicJwk(key:JsonWebKey):JsonWebKey{if(key.kty!=='EC'||key.crv!=='P-256'||!key.x||!key.y)throw new AppError(503,'SIGNING_CONFIGURATION','Signing key is unavailable.');return {kty:'EC',crv:'P-256',x:key.x,y:key.y}}
export async function signerInfo(raw?:string){if(!raw)return {configured:false,purpose:attestationPurpose};const publicKey=publicJwk(JSON.parse(raw));return {configured:true,algorithm:'ECDSA-P256-SHA256',keyId:await digest(publicKey),publicKey,purpose:attestationPurpose}}
export async function attest(evidence:string,scope:{spaceId:string;recordId:string;kind:string},raw?:string){
 if(!raw)throw new AppError(503,'SIGNING_UNAVAILABLE','Evidence signing is not configured.');
 const jwk=JSON.parse(raw),publicKey=publicJwk(jwk),keyId=await digest(publicKey);
 const key=await crypto.subtle.importKey('jwk',jwk,{name:'ECDSA',namedCurve:'P-256'},false,['sign']);
 const statement={format:'sandbox-export-attestation-v1',algorithm:'ECDSA-P256-SHA256',keyId,...scope,sha256:await digest(evidence),signedAt:new Date().toISOString(),purpose:attestationPurpose};
 const signature=base64(new Uint8Array(await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},key,new TextEncoder().encode(canonical(statement)))));
 const result={statement,signature,publicKey,evidence};
 if(!await verifyAttestation(result,publicKey))throw new AppError(503,'SIGNING_CONFIGURATION','Signing key failed its self-check.');return result;
}
export async function verifyAttestation(bundle:any,trustedPublicKey:JsonWebKey){try{
 if(bundle.statement?.format!=='sandbox-export-attestation-v1'||bundle.statement.algorithm!=='ECDSA-P256-SHA256'||typeof bundle.evidence!=='string')return false;
 const pub=publicJwk(trustedPublicKey);
 if(await digest(pub)!==bundle.statement.keyId||await digest(bundle.evidence)!==bundle.statement.sha256)return false;
 const key=await crypto.subtle.importKey('jwk',pub,{name:'ECDSA',namedCurve:'P-256'},false,['verify']);
 return await crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'},key,unbase64(bundle.signature) as BufferSource,new TextEncoder().encode(canonical(bundle.statement)));
 }catch{return false}}
