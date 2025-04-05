import { NextRequest, NextResponse } from 'next/server';
import { MiniAppPaymentSuccessPayload } from '@worldcoin/minikit-js';

interface IRequestPayload {
	payload: MiniAppPaymentSuccessPayload;
}

// Replace with your actual method to retrieve the reference from your database
async function getReferenceFromDB(transactionId: string): Promise<string | undefined> {
	// Example using a simple in-memory map (replace with your database logic)
	const referenceMap: Record<string, string> = {
		'some-unique-transaction-id-123': 'your-original-reference-123',
		// Add more mappings as needed
	};
	return referenceMap[transactionId];
}

export async function POST(req: NextRequest) {
	try {
		const { payload } = (await req.json()) as IRequestPayload;

		// IMPORTANT: Fetch the reference you created in /initiate-payment
		const reference = await getReferenceFromDB(payload.transaction_id);

		if (!reference) {
			console.error('Reference not found for transaction ID:', payload.transaction_id);
			return NextResponse.json({ success: false, error: 'Reference not found' }, { status: 400 });
		}

		// 1. Check that the transaction we received from the mini app matches the reference we stored
		if (payload.reference === reference) {
			const appId = process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID;
			const apiKey = process.env.WORLDCOIN_DEV_PORTAL_API_KEY;

			if (!appId || !apiKey) {
				console.error('Worldcoin App ID or API Key not configured.');
				return NextResponse.json({ success: false, error: 'Worldcoin configuration error' }, { status: 500 });
			}

			const response = await fetch(
				`https://developer.worldcoin.org/api/v2/minikit/transaction/${payload.transaction_id}?app_id=${appId}`,
				{
					method: 'GET',
					headers: {
						Authorization: `Bearer ${apiKey}`,
					},
				}
			);

			if (!response.ok) {
				console.error('Error fetching transaction details from Worldcoin API:', response.status, await response.text());
				return NextResponse.json({ success: false, error: 'Failed to fetch transaction details' }, { status: response.status });
			}

			const transaction = await response.json();

			// 2. Verify the transaction status and reference
			if (transaction?.reference === reference && transaction?.status !== 'failed') {
				// Here you would typically update your database to mark the payment as successful
				console.log(`Payment successful for transaction ID: ${payload.transaction_id}, reference: ${reference}`);
				return NextResponse.json({ success: true });
			} else {
				console.warn(
					`Transaction verification failed for ID: ${payload.transaction_id}, expected reference: ${reference}, received status: ${transaction?.status}, received reference: ${transaction?.reference}`
				);
				return NextResponse.json({ success: false, error: 'Transaction verification failed' }, { status: 400 });
			}
		} else {
			console.error(
				`Reference mismatch for transaction ID: ${payload.transaction_id}, received: ${payload.reference}, expected: ${reference}`
			);
			return NextResponse.json({ success: false, error: 'Reference mismatch' }, { status: 400 });
		}
	} catch (error) {
		console.error('Error processing payment success webhook:', error);
		return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
	}
}