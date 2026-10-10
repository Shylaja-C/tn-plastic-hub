'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ApiError, contactsApi } from '@/lib/api';
import { Loader2, CheckCircle2 } from 'lucide-react';

export default function ContactsPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', category: 'general' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await contactsApi.submit(form);
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to send');
    } finally { setLoading(false); }
  };

  if (sent) return (
    <div className="container mx-auto py-12 px-4 max-w-lg text-center">
      <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
      <h1 className="text-2xl font-bold mb-2">Message Sent!</h1>
      <p className="text-muted-foreground">We&apos;ll get back to you shortly.</p>
      <Button className="mt-6" onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', subject: '', message: '', category: 'general' }); }}>Send Another</Button>
    </div>
  );

  return (
    <div className="container mx-auto py-12 px-4 max-w-lg">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Contact Us</h1>
      <p className="text-muted-foreground mb-6">Have a question? We&apos;d love to hear from you.</p>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handle} className="space-y-4">
            <div><label className="text-sm font-medium">Name *</label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
            <div><label className="text-sm font-medium">Email *</label><Input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
            <div><label className="text-sm font-medium">Phone</label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
            <div><label className="text-sm font-medium">Subject *</label><Input required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} /></div>
            <div><label className="text-sm font-medium">Message *</label><textarea required className="w-full min-h-[100px] rounded-lg border border-input bg-transparent px-3 py-2 text-sm" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} /></div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>{loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Send Message</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
