export default function Blog() {
  const posts = [
    {
      tag: "Nutrition",
      color: "bg-green-50 text-green-700",
      title: "5 Science-Backed Strategies for Sustainable Weight Loss",
      desc: "Discover evidence-based approaches that go beyond crash diets — focusing on long-term lifestyle changes that actually stick.",
      date: "Jun 5, 2026",
      readTime: "5 min read",
    },
    {
      tag: "Health Tips",
      color: "bg-blue-50 text-blue-700",
      title: "Why Tracking Your Daily Water Intake Matters More Than You Think",
      desc: "Hydration affects everything from energy levels to metabolism. Learn how proper water intake can transform your health journey.",
      date: "Jun 1, 2026",
      readTime: "3 min read",
    },
    {
      tag: "For Doctors",
      color: "bg-purple-50 text-purple-700",
      title: "How Digital Tools Are Transforming Nutritional Counseling",
      desc: "A look at how platforms like Healthia are helping nutritionists manage more patients with better outcomes and less admin overhead.",
      date: "May 28, 2026",
      readTime: "7 min read",
    },
  ]
  return (
    <section className="bg-gray-50 py-20" id="blog">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <p className="mb-2 text-xs font-bold tracking-widest text-[#1a6b3a] uppercase">
            Blog
          </p>
          <h2 className="text-2xl font-bold text-gray-900">
            Latest from Healthia
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Tips, insights, and updates from our team.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.title}
              className="cursor-pointer rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${post.color}`}
              >
                {post.tag}
              </span>
              <h3 className="mt-3 mb-2 text-sm leading-snug font-bold text-gray-900">
                {post.title}
              </h3>
              <p className="mb-4 text-xs leading-relaxed text-gray-500">
                {post.desc}
              </p>
              <div className="flex items-center justify-between text-[10px] text-gray-400">
                <span>{post.date}</span>
                <span>{post.readTime}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
