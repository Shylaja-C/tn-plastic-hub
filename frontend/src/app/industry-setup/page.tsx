'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ApiError, companiesApi } from '@/lib/api';
import { Loader2 } from 'lucide-react';
import { RoleGuard } from '@/components/RoleGuard';

export default function IndustrySetupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', company_type: 'manufacturer', state: 'Tamil Nadu', email: '', phone: '', city: '', address: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await companiesApi.create(form);
      router.push('/industry');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Failed to register company.');
    } finally { setLoading(false); }
  };

  const set = (k: string, v: string) => setForm({ ...form, [k]: v });

  return (
    <RoleGuard roles={['industry', 'entrepreneur']}>
    <div className="container mx-auto py-12 px-4 max-w-lg">
      <h1 className="text-3xl font-bold tracking-tight mb-2">Register Your Company</h1>
      <p className="text-muted-foreground mb-6">Set up your company profile to start posting opportunities.</p>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handle} className="space-y-4">
            <div><label className="text-sm font-medium">Company Name *</label><Input required value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
            <div>
              <label className="text-sm font-medium">Type *</label>
              <select className="w-full h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm" value={form.company_type} onChange={(e) => set('company_type', e.target.value)}>
                <option value="manufacturer">Manufacturer</option><option value="recycler">Recycler</option><option value="supplier">Supplier</option><option value="exporter">Exporter</option><option value="other">Other</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-sm font-medium">City</label><Input value={form.city} onChange={(e) => set('city', e.target.value)} /></div>
              <div><label className="text-sm font-medium">State</label><Input value={form.state} onChange={(e) => set('state', e.target.value)} /></div>
            </div>
            <div><label className="text-sm font-medium">Email</label><Input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></div>
            <div><label className="text-sm font-medium">Phone</label><Input value={form.phone} onChange={(e) => set('phone', e.target.value)} /></div>
            <div><label className="text-sm font-medium">Address</label><Input value={form.address} onChange={(e) => set('address', e.target.value)} /></div>
            <div><label className="text-sm font-medium">Description</label><textarea className="w-full min-h-[80px] rounded-lg border border-input bg-transparent px-3 py-2 text-sm" value={form.description} onChange={(e) => set('description', e.target.value)} /></div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" className="w-full" disabled={loading}>{loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}Register Company</Button>
          </form>
        </CardContent>
      </Card>
    </div>
    </RoleGuard>
  );
}
