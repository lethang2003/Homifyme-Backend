const initializeApp = require("firebase/app").initializeApp;
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const serviceAccount = {
  type: "service_account",
  project_id: "homifyme-907f5",
  private_key_id: "dab3e1b3eee661c9255ae64c7a72cb475442b534",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC7YfKaFJaYVKPN\nGQZ0zePmW36lDeo9toQifgLkn2i6ygOEl2AhtdWPczhYBgmwMee4N0jO3q2ZPKrW\n8PWYXj08s2PrgNAiRrOdJTvgF+cOWeHSL0L63I41+Jib5ovG2BdvgXpS1xrXCc8C\nlu9JEtEYOA5C87tDfdOetL0VqxDbUXEm4pl9Jv+UlXwRyULs0RC7BSpfwNlqa1M8\naBTCm1+MXx2Pk23O6p3bJhuXxRaM5rbPn47G9KVd7wpbffLNaswmBWIKq25+7LJC\nQ3WCdVa9E1o78v72uG90VxeuLXBsK6ANqyqvRAF8xYwqTOFoa4wr2KLkAVLYmTwr\n5VAZpqsBAgMBAAECggEADok+pK1MMWz/d/2k/pKqR0h5vpwhu7/Y6EQWPV4QZc0e\nEL8def/9HS+3Az0Uq1Jzw1qmj0W++dA3AI2Yv8UvwvG3oqFPhBkv/dTRnES+a+KV\nHhUEgSly7sTmMdHkrfw9dSz6LEr7jgr4wB6tWWHYTqSqlo8Jy+aK8BjdQj0PBbRd\nb9x5y+Fx6UeJzAFuSRHADLJP1noS+foTrCocNouNWYnUL4ZiK5so1nskFs3IJzuK\ng5e6Ot3k4llao4HKWYWvCTvWw2OHPW36bh+Q2AwbpTqzdlXYO9pQLe7OzBHjKfLk\n+oJYvFsRfkinIyEVWA8keiI02TbZyHHLEQzvsQKLQQKBgQD4GTnbsL5YwOoEaa1e\nNtwd2p0jBq+MPA4w6OVFwUVlWkNd0Sq6FV9gyFRxkyMetwzDq1D0OvZchrqSOqmt\nEO1+a9bRtmwI8b2txWBxBR+5elvdVgImEb7yrMj8HUbNpQgug9YHUKd9VZ+syb19\n4O0ur0WViq4A9vKj7Gawmv329QKBgQDBWbK6jtBKcOciE+fQClkymjHSImM0Z4NR\n8vFd+kxQjGJb+X75UIoB+dguc7hguNziEKgkYuXs+4xwOspPPMo3bLF8BmK2rIsS\nYWTIFY6hbEqwNQgVCEup4mT7ZVxNLyq/ngIXjSX9ie9rK8coQWBTwR9KAR7M+3QQ\nWa23kROkXQKBgBBAbsbSVBWyRWIWnhGu3EpkWKjDtlokUPWpO+OO3oHeIM2Tdw4L\nelz3onhyH/nSGdbzcPEer6at+Ki9iQHaOwRuAftozLjlRPyOElw07rgSqNPd33Qo\n824oHV5OeKXd6qRJZIrEIMSYCEakTHJjeoX1W0SJeg58HrbYNH3bGUnFAoGAE3+J\nL5kRVkB2fpBFU0yH3DuChK9lE7bQnmYCgzink4Pks2PAs0G0+SgJ7f1Lfa2G0OFf\nI3Q5vaFMc1Dqb/0wY1B5wYkfUU6rI6pgsHDEFnFGQujGLODOSI6FInkBSuNTy0kS\n6u8YAq5zT3p1thCJt0iFcEAWrBM7jB6PDzD5Kx0CgYBRt0QoJju4XbRzzlcuBfaK\nZ2xWKdd6qA10wYtfvjl6gr+CogvgHC998wfyWx++sXMGQFp7pNg4HBd6F9hqPIpw\nv1hMnjFYOC1TtEVSMAtIhZAvAKCkGvEq99dnVPYeavjDubkIBL2woufnpNTPbCpk\ngrCGrfWOWkNK4qWhRuSEgg==\n-----END PRIVATE KEY-----\n",
  client_email:
    "firebase-adminsdk-fq7z9@homifyme-907f5.iam.gserviceaccount.com",
  client_id: "110064256388785029317",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fq7z9%40homifyme-907f5.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

// Initialize Firebase
const app = initializeApp(serviceAccount);
module.exports = { app, serviceAccount };
