import { Button, Card, CardContent, CardHeader, Input, Modal } from '@vetted/ui';

export default function Page() {
  return (
    <main className="p-6 space-y-4">
      <div className="text-xl font-semibold">Web+BFF OK</div>
      <Card>
        <CardHeader>Shared UI</CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <Input placeholder="Type here" />
            <Button>Click</Button>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}


