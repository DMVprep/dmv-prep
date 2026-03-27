const fs = require('fs');
const path = require('path');

const POPULAR_STATES = [
  { name: 'Florida', slug: 'florida' },
  { name: 'California', slug: 'california' },
  { name: 'Texas', slug: 'texas' },
  { name: 'New York', slug: 'new-york' },
  { name: 'Illinois', slug: 'illinois' },
  { name: 'Pennsylvania', slug: 'pennsylvania' },
  { name: 'Ohio', slug: 'ohio' },
  { name: 'Georgia', slug: 'georgia' },
  { name: 'North Carolina', slug: 'north-carolina' },
  { name: 'Michigan', slug: 'michigan' },
];

const INTERNAL_LINKS_BLOCK = `
          {/* Internal Links - Other States */}
          <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Practice Tests for Other States</h2>
            <p className="text-sm text-gray-500 mb-4">Select your state to get questions specific to your DMV exam.</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {[
                { name: 'Florida', slug: 'florida' },
                { name: 'California', slug: 'california' },
                { name: 'Texas', slug: 'texas' },
                { name: 'New York', slug: 'new-york' },
                { name: 'Illinois', slug: 'illinois' },
                { name: 'Pennsylvania', slug: 'pennsylvania' },
                { name: 'Ohio', slug: 'ohio' },
                { name: 'Georgia', slug: 'georgia' },
                { name: 'North Carolina', slug: 'north-carolina' },
                { name: 'Michigan', slug: 'michigan' },
              ].filter(s => s.slug !== params.state).map((s) => (
                <Link
                  key={s.slug}
                  href={\`/state/\${s.slug}/dmv-practice-test\`}
                  className="flex items-center justify-center px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-sm text-gray-700 font-medium"
                >
                  {s.name}
                </Link>
              ))}
            </div>
            <div className="mt-3">
              <Link href="/states" className="text-blue-600 text-sm hover:underline inline-flex items-center gap-1">
                See all 50 states <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>`;

// Target file
const filePath = 'src/app/state/[state]/dmv-practice-test/page.tsx';

try {
  let f = fs.readFileSync(filePath, 'utf8');
  
  // Check if already added
  if (f.includes('Practice Tests for Other States')) {
    console.log('Already has internal links section');
    process.exit(0);
  }

  // Find the Footer closing tag and insert before it
  const target = '\n      </main>\n      <Footer />';
  if (f.includes(target)) {
    f = f.replace(target, INTERNAL_LINKS_BLOCK + target);
    fs.writeFileSync(filePath, f);
    console.log('✅ Internal links added to dmv-practice-test page');
  } else {
    console.log('❌ Target not found - checking file end...');
    // Show last 200 chars
    console.log(f.slice(-200));
  }
} catch(e) {
  console.log('Error:', e.message);
}
