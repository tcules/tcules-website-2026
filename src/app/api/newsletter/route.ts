import { submitClientContact } from '../_client-contact';

export function POST(request: Request) {
  return submitClientContact(request, 'newsletter');
}
