import { UserApiResponse } from '@book-rental-app/shared/types';
import { UserPermission } from '@book-rental-app/shared/utils';
import { NextURL } from 'next/dist/server/web/next-url';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
	const sessionToken = req.cookies.get('session');
	if (!sessionToken || typeof sessionToken !== 'string') {
		return NextResponse.redirect(getLoginUrl(req.nextUrl));
	}

	const user = await getUser(sessionToken);

	if (!user) {
		return NextResponse.redirect(getLoginUrl(req.nextUrl));
	}

	const userPermissions = new UserPermission(user);
	if (
		req.nextUrl.pathname.startsWith('/admin') &&
		!userPermissions.hasPermission('ADMIN')
	) {
		const url = req.nextUrl.clone();
		url.pathname = '/';
		return NextResponse.redirect(url);
	}

	return NextResponse.next();
}

function getLoginUrl(nextUrl: NextURL) {
	const url = nextUrl.clone();
	url.pathname = '/login';
	url.searchParams.set('redirect', nextUrl.href);
	return url;
}

async function getUser(sessionToken: string) {
	try {
		const response = await fetch(
			process.env.NEXT_PUBLIC_API_ENDPOINT + '/@me',
			{
				headers: {
					Authorization: sessionToken,
				},
			}
		);

		if (!response.ok) return null;

		const json: UserApiResponse = await response.json();
		return json.user;
	} catch (err) {
		console.error(err);
		return null;
	}
}

export const config = {
	matcher: ['/admin/:path*', '/profile/:path*'],
};
