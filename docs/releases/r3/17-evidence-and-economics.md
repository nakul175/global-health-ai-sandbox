# Evaluation methodology and economic calculations

Status: proposed executable-method specification. The reference fixtures test arithmetic and reporting behaviour, not clinical performance or cost effectiveness of any real product.

## Evidence and comparison

Evidence classes: `synthetic`, `retrospective`, `prospective`, `supplier_declared`. Every run and report retains class, intended use, population, source permission, time window, method and limitations. Clinical reference labels need an institution-approved reference standard; synthetic labels are generation inputs only.

Pin model, cohort, threshold, inclusion/exclusion, context, protocol and scorer. Compare suppliers on the same eligible cohort. Report input/eligible/completed/error counts and exclusions by reason. Coverage = completed / eligible. Failed cases cannot silently vanish; partial metrics carry coverage and cannot satisfy a complete-cohort acceptance gate. If comparing subsets, define the paired common cohort explicitly and report its selection limitations.

Threshold rule: probability >= threshold is positive. Sensitivity = TP/(TP+FN); specificity = TN/(TN+FP); precision = TP/(TP+FP); accuracy = (TP+TN)/(TP+FP+TN+FN). A zero denominator produces `not_estimable`, not 0 or 1. Use 95% Wilson intervals for proportions (z = 1.959963984540054), with numerator/denominator stored. Paired comparison uses McNemar's exact two-sided binomial test on discordant pairs; any multiplicity adjustment is pre-specified in the protocol. Do not claim superiority from a raw point estimate alone.

Subgroups are pre-specified; default disclosure threshold 10 observed records, adjustable only in an approved protocol/policy. Below threshold return suppressed counts/metrics and `insufficient_evidence`. This disclosure threshold is not a clinical sample-size calculation. Adequate sample size, prevalence and power depend on the evaluation question and require statistical review.

## Budget inputs

- Annual screening volume N (integer); prevalence p, sensitivity Se, specificity Sp and referral completion r (decimal fractions in [0,1]).
- Annual confirmatory capacity C (integer).
- Screening unit cost s and confirmatory unit cost c (nonnegative integer minor currency units).
- Initial setup cost K and annual fixed operating cost F (nonnegative integer minor units).
- Horizon H (1–5 years), currency and minor-unit exponent (0–3), price date and cost-source records.
- Funding commitments by source/year; one commitment moves from committed to received without adding its value twice.

## Deterministic equations

Expected disease = N × p; TP = N × p × Se; FN = N × p × (1−Se); FP = N × (1−p) × (1−Sp); TN = N × (1−p) × Sp.

Positive screens = TP + FP. Confirmatory demand = (TP + FP) × r. Capacity gap = max(0, demand−C). Annual variable cost = N × s + demand × c. Year 1 total = K + F + variable cost. Later years = F + variable cost, unless an explicit year-specific schedule changes inputs. Total programme cost is the sum of annual totals. Secured funding includes committed or received amounts once per unique commitment. Annual funding gap = max(0, annual total−secured funding).

Expected counts may be fractional; preserve decimal precision through the calculation and display to two decimal places. Currency totals round half-up once per annual total to integer minor units. Store rates as decimal strings (up to six decimal places) and money as integers; no NaN/Infinity or binary-float currency accumulation. When dividing money by a count, retain decimal result and state the denominator. Zero denominator is not estimable.

Do not label TP as confirmed cases, lives saved or observed benefit. Confirmatory completion, test sensitivity and treatment linkage would need additional evidence and a separately specified model. A capacity gap is a workload indicator; waiting times require a validated queue model with arrival/service distributions. No such waiting-time inference is included in R3A.

## Reference scenario — synthetic only

N=10,000; p=0.10; Se=0.80; Sp=0.90; r=1.00; C=1,500. Screening cost=1,000 minor units; confirmatory cost=10,000; setup=5,000,000; annual fixed=2,000,000; INR exponent=2; H=3.

Expected TP=800, FN=200, FP=900, TN=8,100; positive screens/demand=1,700; capacity gap=200. Annual variable cost=27,000,000 minor units. Year totals=34,000,000; 29,000,000; 29,000,000. Three-year total=92,000,000 (INR 920,000). With secured funding 34,000,000; 20,000,000; 0, annual gaps are 0; 9,000,000; 29,000,000; total gap=38,000,000 (INR 380,000).

These numbers are arbitrary fixture inputs, not real prices or TB epidemiology. The SQL seed and acceptance JSON label them synthetic. A validation check recomputes results independently and includes zero-denominator, currency-mismatch and partial-coverage cases.

## Scenarios and decision interpretation

Low/base/high input sets show sensitivity to assumptions, not statistical confidence intervals. Baseline/current-service comparison requires its own complete inputs. Report absolute and incremental costs; do not compute an ROI, DALYs, QALYs or cost-effectiveness threshold without a separately reviewed outcomes model. Funding availability is separate from economic value and does not determine supplier eligibility automatically.
