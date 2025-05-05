/** @type {import('next').NextConfig} */
const nextConfig = {
	output: "standalone",
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "i.scdn.co",
				port: "",
				pathname: "/**",
			},
		],
	},
	experimental: {
		reactCompiler: true,
	}
};

export default nextConfig;
