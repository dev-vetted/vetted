import { Button, Card, CardContent, CardHeader } from '@vetted/ui';
import Link from 'next/link';

export default function Page() {
  return (
    <main className="p-6 space-y-4">
      <div className="text-xl font-semibold">Web+BFF Consumer App</div>
      <Card>
        <CardHeader>Navigation</CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Link href="/pets">
              <Button>View Pets (tRPC)</Button>
            </Link>
            <Link href="http://localhost:3001" target="_blank">
              <Button>Open Vendor App (REST)</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}


