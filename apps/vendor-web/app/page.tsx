import { Button, Card, CardContent, CardHeader, Input } from '@vetted/ui';

export default function Page() {
  return (
    <main className="p-6 space-y-4">
      <div className="text-xl font-semibold">Vendor OK</div>
      <Card>
        <CardHeader>Shared UI</CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Input placeholder="Search" />
            <Button>Go</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}


