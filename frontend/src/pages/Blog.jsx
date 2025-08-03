import { Link } from 'react-router-dom';

// Dummy data for the blog articles
const articles = [
    { 
        id: 1, 
        title: "10 Tips for a Healthier Heart", 
        category: "Women's Health", 
        image: "https://placehold.co/600x400/EF4444/FFFFFF?text=Heart+Health",
        excerpt: "Learn about simple lifestyle changes you can make to improve your cardiovascular health and reduce your risk of heart disease."
    },
    { 
        id: 2, 
        title: "Understanding Anxiety and How to Cope", 
        category: "Mental Health", 
        image: "https://placehold.co/600x400/6366F1/FFFFFF?text=Mental+Health",
        excerpt: "Anxiety is a common issue, but there are effective strategies to manage it. Discover coping mechanisms that can help."
    },
    { 
        id: 3, 
        title: "A Parent's Guide to Children's Nutrition", 
        category: "Kids' Health", 
        image: "https://placehold.co/600x400/22C55E/FFFFFF?text=Kids+Nutrition",
        excerpt: "Ensuring your child gets the right nutrients is key to their growth. Here are some tips for a balanced diet for kids."
    },
];

export default function Blog() {
    return (
        <div className="section__container py-12">
            <div className="text-center mb-12">
                <h1 className="font-poppins text-4xl font-bold text-text-dark">Health & Wellness Blog</h1>
                <p className="text-text-light mt-2">Articles written and reviewed by our expert doctors.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map(article => (
                    <div key={article.id} className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                        <img src={article.image} alt={article.title} className="w-full h-48 object-cover" />
                        <div className="p-6">
                            <p className="text-sm text-primary font-semibold mb-2">{article.category}</p>
                            <h3 className="font-poppins text-xl font-bold mb-2 h-16">{article.title}</h3>
                            <p className="text-text-light text-sm mb-4 h-20">{article.excerpt}</p>
                            <Link to="#" className="font-semibold text-secondary hover:underline">Read More &rarr;</Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}