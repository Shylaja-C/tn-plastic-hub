import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Menu, Factory } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Industry Setup', href: '/industry-setup' },
  { name: 'Opportunities', href: '/internships' },
  { name: 'Technology', href: '/technologies' },
  { name: 'News', href: '/news' },
  { name: 'AI Assistant', href: '/ai-assistant' },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Factory className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold sm:text-xl tracking-tight text-primary">
              PlasticX
            </span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary text-muted-foreground"
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search companies, schemes..."
              className="w-[200px] lg:w-[300px] pl-8 bg-muted/50"
            />
          </div>
          
          <div className="hidden sm:flex items-center gap-2">
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }))}>Login</Link>
            <Link href="/register" className={cn(buttonVariants({ variant: "default" }))}>Register</Link>
          </div>

          <Sheet>
            <SheetTrigger render={<Button variant="outline" size="icon" className="md:hidden" />}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link href="/" className="flex items-center space-x-2 mb-8">
                <Factory className="h-6 w-6 text-primary" />
                <span className="font-bold">PlasticX</span>
              </Link>
              <nav className="flex flex-col gap-4">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium"
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="h-px bg-border my-2" />
                <Link href="/login" className="text-sm font-medium">Login</Link>
                <Link href="/register" className="text-sm font-medium text-primary">Register</Link>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
