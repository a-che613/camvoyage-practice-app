import withPWA from "@ducanh2912/next-pwa";

const pwaConfig = withPWA({
  dest: "public",
});

export default {
  ...pwaConfig,
  // Your Next.js config
};