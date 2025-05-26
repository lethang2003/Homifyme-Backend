require("dotenv").config();

module.exports = {
  secretKey: process.env.SECRET_KEY,
  database: process.env.DATABASE_URL,
  // VNPay
  vnp_TmnCode: process.env.VNP_TMNCODE,
  vnp_HashSecret: process.env.VNP_HASHSECRET,
  vnp_Url: process.env.VNP_URL,
  vnp_Api: process.env.VNP_API,
  vnp_ReturnUrl: process.env.VNP_RETURNURL,
  // Google
  web: {
    client_id: process.env.GOOGLE_CLIENT_ID,
    project_id: process.env.GOOGLE_PROJECT_ID,
    auth_uri: process.env.GOOGLE_AUTH_URI,
    token_uri: process.env.GOOGLE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
    client_secret: process.env.GOOGLE_CLIENT_SECRET,
    redirect_uris: process.env.GOOGLE_REDIRECT_URIS,
    javascript_origins: [process.env.GOOGLE_JAVASCRIPT_ORIGINS],
  },
  //Firebase
  storage_bucket: process.env.FIREBASE_STORAGE_BUCKET,
  //bank
  bankCode: process.env.BANK_CODE,
  bankAccountNumber: process.env.BANK_ACCOUNT_NUMBER,
  bankAccountName: process.env.BANK_ACCOUNT_NAME,
};
