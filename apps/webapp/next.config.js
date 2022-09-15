// eslint-disable-next-line @typescript-eslint/no-var-requires
const { withNx } = require('@nrwl/next/plugins/with-nx');

/**
 * @type {import('@nrwl/next/plugins/with-nx').WithNxOptions}
 **/
const nextConfig = {
	compiler: {
		styledComponents: true,
	},
	swcMinify: true,
	images: {
		remotePatterns: [
			{
				hostname: 'res.cloudinary.com',
				protocol: 'https',
			},
		],
	},
	nx: {
		svgr: false,
	},
};

module.exports = withNx(nextConfig);
