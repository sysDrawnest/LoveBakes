import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const usersCount = await prisma.user.count();
    console.log(`Total users in DB: ${usersCount}`);
    const lastUser = await prisma.user.findFirst({
        orderBy: { createdAt: 'desc' }
    });
    if (lastUser) {
        console.log(`Last registered user: ${lastUser.email} (Created at: ${lastUser.createdAt})`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
