import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  
  const services = [
    {
      name: "Digital Offset Printing",
      price: 1000,
      imageUrl: "/offset.png,/cup.png",
      description: "Digital and offset printing are two methods of producing printed materials..."
    },


    {
      name: "Forms & Receipts",
      price: 700,
      imageUrl: "/forms.png,/cup.png,/forms.png",
      description: "Our Form & Receipt Printing Service is designed to streamline your documentation process..."
    },



    {

      name: "Panaflex Signage",
      price: 600,
      imageUrl: "/panaflex.png,/cup.png,/forms.png",
      description: "A transluscent canvas made with special substances that permit light to pass through it."
    },
    // Add all 21 services from your HeaderContext here...
    // Add all the new services from your image
  ]

  for (const service of services) {
    await prisma.service.upsert({
      where: { name: service.name },

      update: service,
      create: service,
    })
  }
}


main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })