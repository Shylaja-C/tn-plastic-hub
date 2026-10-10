export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4 max-w-3xl">
      <h1 className="text-3xl font-bold tracking-tight mb-6">About TNPlasticHub</h1>
      <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
        <p>
          <strong>TNPlasticHub</strong> is a digital platform connecting students, entrepreneurs,
          and plastics-industry companies across Tamil Nadu. Our mission is to bridge the gap
          between academic talent and industrial opportunity in one of India&apos;s fastest-growing
          manufacturing sectors.
        </p>
        <h2 className="text-xl font-semibold mt-8">What We Offer</h2>
        <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
          <li><strong>Internships</strong> — Browse and apply for hands-on internship positions at leading plastics companies.</li>
          <li><strong>Industrial Visits</strong> — Book guided tours of manufacturing facilities to see processes first-hand.</li>
          <li><strong>Government Schemes &amp; Loans</strong> — Discover subsidies, grants, and financing options for plastics entrepreneurs.</li>
          <li><strong>Industry News</strong> — Stay up-to-date with the latest trends, regulations, and innovations.</li>
          <li><strong>AI Assistant</strong> — Get instant answers about the industry, schemes, and career paths.</li>
        </ul>
        <h2 className="text-xl font-semibold mt-8">Our Vision</h2>
        <p className="text-muted-foreground">
          To become Tamil Nadu&apos;s leading industry–academia platform for the plastics sector,
          fostering sustainable growth, innovation, and employment.
        </p>
        <h2 className="text-xl font-semibold mt-8">Contact</h2>
        <p className="text-muted-foreground">
          Reach out to us via our <a href="/contacts" className="text-primary hover:underline">contact form</a> or
          email <strong>info@tnplastichub.in</strong>.
        </p>
      </div>
    </div>
  );
}
