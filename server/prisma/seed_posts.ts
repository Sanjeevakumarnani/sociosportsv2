
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const blogContent = [
    {
        title: 'Top 5 Nutrition Tips for Young Athletes',
        content: `# Fueling the Future: Top 5 Nutrition Tips for Young Athletes

Expert guidance on how to optimize your diet for peak performance, sustained energy, and rapid recovery.

## 1. Hydration is Non-Negotiable
Water is the most critical nutrient for athletes. Even 2% dehydration can lead to a significant drop in performance and cognitive function.
- **Before**: Drink 500ml 2 hours before exercise.
- **During**: Small sips every 15-20 minutes.
- **After**: Rehydrate slowly but steadily.

## 2. Timing the "Window"
Your body is most receptive to nutrients in the 30-60 minutes following intense activity. This is the "Anabolic Window."
- Focus on a 3:1 ratio of carbohydrates to protein.
- A simple banana and a protein shake or a bowl of yogurt with fruit can kickstart the repair process.

## 3. Don't Fear the Fats
Healthy fats (omega-3s) are essential for reducing inflammation and supporting brain health.
- Include avocados, nuts, seeds, and oily fish in your weekly meal plan.
- Stay away from trans fats found in processed snacks.

## 4. Quality Over Calories
While young athletes need significant energy, where that energy comes from matters.
- Prioritize whole grains, lean proteins, and a "rainbow" of vegetables.
- Minimize sugary drinks and highly processed "energy" bars that cause insulin spikes.

## 5. Listen to Your Body
Every athlete is different. Keep a food diary to correlate what you eat with how you feel during training.
- Consistency is better than perfection. 
- Build habits that you can maintain long-term.`,
        image: '/images/blog_02.jpg',
        category: 'Health',
        status: 'PUBLISHED'
    },
    {
        title: 'The Penguin Journey: Breaking Barriers in Antarctica',
        content: 'The incredible true story of how grit and adaptation are universal, from the ice caps to the sports arena. A lesson in resilience. \n\n(Full article content would go here...)',
        image: '/images/penguin_journey_cover.png',
        category: 'Inspiration',
        status: 'PUBLISHED'
    },
    {
        title: 'Coach Sunita\'s Empty Facility: A Solved Problem',
        content: 'How one booking app transformed a barren badminton court into a thriving academy in just 3 months. The power of digital visibility. \n\n(Full article content would go here...)',
        image: '/images/coach_sunita_court.png',
        category: 'Success Stories',
        status: 'PUBLISHED'
    },
    {
        title: 'Telangana\'s Boxing Prodigy: Nikhat Zareen\'s Journey',
        content: 'From the streets of Nizamabad to becoming a World Champion. A story of grit, determination, and breaking barriers.',
        image: '/images/telangana_boxer.png',
        category: 'Athlete Stories',
        status: 'PUBLISHED'
    },
    {
        title: 'SocioSports Podcast: The Hyderabad Badminton Factory',
        content: 'National coaches discuss how Hyderabad became India\'s badminton capital and the future of the sport.',
        image: '/images/podcast_hub.png',
        category: 'Podcasts',
        status: 'PUBLISHED'
    },
    {
        title: 'The Future of Indian Football: Grassroots in Rural Telangana',
        content: 'How local scouting programs are identifying talent in the smallest villages of the state.',
        image: '/images/rural_football.png',
        category: 'Articles',
        status: 'PUBLISHED'
    },
    {
        title: 'Mastering the Smash: Training at Gachibowli Stadium',
        content: 'A professional guide to advanced badminton techniques used by elite athletes in Hyderabad.',
        image: '/images/badminton_action.png',
        category: 'Articles',
        status: 'PUBLISHED'
    }
];

async function main() {
    console.log('Start seeding posts...');

    // Get a default user to be the author
    const author = await prisma.user.findFirst();
    if (!author) {
        console.log('No user found to be author. Skipping posts.');
        return;
    }

    for (const post of blogContent) {
        const existing = await prisma.post.findFirst({
            where: { title: post.title }
        });

        if (!existing) {
            await prisma.post.create({
                data: {
                    ...post,
                    authorId: author.id
                }
            });
            console.log(`Created post: ${post.title}`);
        } else {
            console.log(`Post already exists: ${post.title}`);
        }
    }
    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
