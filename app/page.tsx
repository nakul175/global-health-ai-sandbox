import { getChatGPTUser,chatGPTSignInPath } from './chatgpt-auth';
import Workspace from './workspace';
export const dynamic='force-dynamic';
export default async function Home(){const user=await getChatGPTUser();if(!user)return <main className="signin"><div className="brand-mark">H</div><p className="eyebrow">GLOBAL HEALTH AI SANDBOX</p><h1>Your evaluation workspace.</h1><p>Sign in to open your private synthetic testing environment.</p><a className="primary-link" href={chatGPTSignInPath('/')} target="_top">Sign in with ChatGPT</a><small>This test edition uses synthetic data only. It does not provide clinical validation.</small></main>;return <Workspace userName={user.displayName}/>}
