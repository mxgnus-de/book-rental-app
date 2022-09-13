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
				hostname: 'medien.umbreitkatalog.de',
			},
			{
				hostname: 'm.media-amazon.com',
			},
			{
				hostname: 's3.sky.ch',
			},
			{
				hostname: 'img1.od-cdn.com',
			},
			{
				hostname: 'images.lovelybooks.de',
			},
			{
				hostname: 'www.pokewiki.de',
			},
			{
				hostname: 'bilder.buecher.de',
			},
			{
				hostname: 'covers.openlibrary.org',
			},
			{
				hostname: 'cdn.smehost.net',
			},
			{
				hostname: 'static.wikia.nocookie.net',
			},
		],
	},
	nx: {
		svgr: false,
	},
};

module.exports = withNx(nextConfig);
