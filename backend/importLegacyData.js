import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const importData = async () => {
    try {
        console.log('Inserting old users...');

        // Create Users
        await prisma.user.createMany({
            data: [
                {
                    id: '69ab9a9addc273b000a8b822',
                    name: 'Sai Yangyadatta Sethy',
                    email: 'testadmin@gmail.com',
                    password: '$2b$10$I/mwnSof5q.CePN7ifBPF.oDP1JjbnpBMR31WbRxeh0PTGQCGqRp.',
                    phone: '+918144622958',
                    role: 'user',
                    createdAt: new Date('2026-03-07T03:25:14.157+00:00'),
                    updatedAt: new Date('2026-03-07T03:25:14.157+00:00'),
                },
                {
                    id: '69ab9d76e8bd351217b76d35',
                    name: 'LoveBakes Admin',
                    email: 'admin@lovebakes.in',
                    password: '$2b$10$gVK4Ugcs4gMP6OEvo.mWSOuJ9W3fm/EqRXZhqRzvSEEqidRmszhY6',
                    role: 'admin',
                    createdAt: new Date('2026-03-07T03:37:26.009+00:00'),
                    updatedAt: new Date('2026-03-07T03:37:26.009+00:00'),
                }
            ],
            skipDuplicates: true, // In case script runs twice
        });

        console.log('Inserting old products...');

        // Create Products
        await prisma.product.createMany({
            data: [
                {
                    id: '69ab97cd958ef0a8443bb686',
                    name: 'Chocolate Dream Cake',
                    description: 'Rich dark chocolate layers with silky ganache and whipped cream frosting. A celebration in every bite.',
                    category: 'Cakes',
                    images: ['https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600'],
                    sizes: [{ size: '500g', price: 499 }, { size: '1kg', price: 899 }, { size: '2kg', price: 1699 }],
                    flavors: ['Chocolate', 'Dark Chocolate'],
                    isAvailable: true,
                    createdAt: new Date('2026-03-07T03:13:17.770+00:00'),
                    updatedAt: new Date('2026-03-07T03:13:17.770+00:00'),
                },
                {
                    id: '69ab97cd958ef0a8443bb68a',
                    name: 'Strawberry Bliss Cake',
                    description: 'Layers of vanilla sponge with fresh strawberry compote and light whipped cream. Perfect for summer.',
                    category: 'Cakes',
                    images: ['https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=600'],
                    sizes: [{ size: '500g', price: 449 }, { size: '1kg', price: 849 }, { size: '2kg', price: 1599 }],
                    flavors: ['Strawberry', 'Vanilla'],
                    isAvailable: true,
                    createdAt: new Date('2026-03-07T03:13:17.773+00:00'),
                    updatedAt: new Date('2026-03-07T03:13:17.773+00:00'),
                },
                {
                    id: '69ab97cd958ef0a8443bb68e',
                    name: 'Red Velvet Romance',
                    description: 'Classic red velvet with cream cheese frosting. Velvety texture, subtle cocoa, deeply indulgent.',
                    category: 'Cakes',
                    images: ['https://images.unsplash.com/photo-1559620192-032c4bc4674e?w=600'],
                    sizes: [{ size: '500g', price: 549 }, { size: '1kg', price: 999 }, { size: '2kg', price: 1899 }],
                    flavors: ['Red Velvet', 'Cream Cheese'],
                    isAvailable: true,
                    createdAt: new Date('2026-03-07T03:13:17.773+00:00'),
                    updatedAt: new Date('2026-03-07T03:13:17.773+00:00'),
                }
            ],
            skipDuplicates: true,
        });

        console.log('✅ Legacy data successfully imported!');
    } catch (error) {
        console.error('Error importing data:', error);
    } finally {
        await prisma.$disconnect();
    }
};

importData();
