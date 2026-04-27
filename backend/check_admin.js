import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const user = await prisma.user.findUnique({
        where: { email: 'admin@lovebakes.in' }
    });
    if (user) {
        console.log(`User found: ${user.email}`);
        console.log(`Role: ${user.role}`);
        // No password logging for security, but we know it's there
    } else {
        console.log('User NOT found: admin@lovebakes.in');
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
