// GCP Workload Identity & Secret Manager Conduit for Vercel Serverless Functions
// Pathway: Vercel OIDC Token -> GCP STS -> Service Account Impersonation -> Secret Manager (SOVEREIGN_KEY)

const GCP_PROJECT_ID = "ignitus-d1e7b";
const GCP_PROJECT_NUMBER = "34837262732";
const WORKLOAD_POOL = "vercel-oidc";
const WORKLOAD_PROVIDER = "vercel-team";
const FEDERATED_SA = "tiana-1-5-federated@ignitus-d1e7b.iam.gserviceaccount.com";

let cachedKey = "";

export async function fetchSovereignKeyFromSecretManager() {
  // Return cached key if already resolved in process lifecycle
  if (cachedKey) return cachedKey;

  // 1. Direct environment variable resolution
  if (process.env.SOVEREIGN_KEY && process.env.SOVEREIGN_KEY.trim()) {
    cachedKey = process.env.SOVEREIGN_KEY.trim();
    return cachedKey;
  }
  if (process.env.SOVEREIGN_LLM_KEY && process.env.SOVEREIGN_LLM_KEY.trim()) {
    cachedKey = process.env.SOVEREIGN_LLM_KEY.trim();
    return cachedKey;
  }
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) {
    cachedKey = process.env.GEMINI_API_KEY.trim();
    return cachedKey;
  }
  if (process.env.GOOGLE_API_KEY && process.env.GOOGLE_API_KEY.trim()) {
    cachedKey = process.env.GOOGLE_API_KEY.trim();
    return cachedKey;
  }

  // 2. Case-tolerant environment scanning
  for (const [k, v] of Object.entries(process.env)) {
    const clean = k.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (["sovereignkey", "sovereignllmkey", "geminiapikey", "geminikey", "googleapikey", "googlekey"].includes(clean)) {
      if (v && v.trim()) {
        cachedKey = v.trim();
        return cachedKey;
      }
    }
  }

  // 3. Hop 1 to Hop 5: Workload Identity OIDC Secret Manager Exchange
  const oidcToken = process.env.VERCEL_OIDC_TOKEN || process.env.OIDC_TOKEN;
  if (oidcToken) {
    try {
      // Hop 1 -> Hop 2: Security Token Service (STS) Exchange
      const stsResp = await fetch("https://sts.googleapis.com/v1/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          grant_type: "urn:ietf:params:oauth:grant-type:token-exchange",
          subject_token_type: "urn:ietf:params:oauth:token-type:jwt",
          requested_token_type: "urn:ietf:params:oauth:token-type:access_token",
          subject_token: oidcToken,
          audience: `//iam.googleapis.com/projects/${GCP_PROJECT_NUMBER}/locations/global/workloadIdentityPools/${WORKLOAD_POOL}/providers/${WORKLOAD_PROVIDER}`,
          scope: "https://www.googleapis.com/auth/cloud-platform"
        })
      });

      if (stsResp.ok) {
        const stsData = await stsResp.json();
        const federatedToken = stsData.access_token;

        // Hop 3: Service Account Impersonation Access Token
        const saResp = await fetch(
          `https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/${FEDERATED_SA}:generateAccessToken`,
          {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${federatedToken}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              scope: ["https://www.googleapis.com/auth/cloud-platform"]
            })
          }
        );

        if (saResp.ok) {
          const saData = await saResp.json();
          const gcpAccessToken = saData.accessToken;

          // Hop 4 & Hop 5: Secret Manager Access
          const secretResp = await fetch(
            `https://secretmanager.googleapis.com/v1/projects/${GCP_PROJECT_ID}/secrets/SOVEREIGN_KEY/versions/latest:access`,
            {
              headers: { "Authorization": `Bearer ${gcpAccessToken}` }
            }
          );

          if (secretResp.ok) {
            const secretData = await secretResp.json();
            const payload = Buffer.from(secretData.payload.data, "base64").toString("utf8").trim();
            if (payload) {
              cachedKey = payload;
              return cachedKey;
            }
          }
        }
      }
    } catch (_) {}
  }

  return "";
}
