import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 既存のデータを削除（オプション）
  await prisma.word.deleteMany({})

  // シードデータの作成
  const words = [
    {
      text: 'こんにちは',
      romaji: 'konnichiwa',
      level: 1,
      category: 'greeting'
    },
    {
      text: 'ありがとう',
      romaji: 'arigatou',
      level: 1,
      category: 'greeting'
    },
    {
      text: 'プログラミング',
      romaji: 'puroguramingu',
      level: 2,
      category: 'technology'
    },
    {
      text: 'タイピング',
      romaji: 'taipingu',
      level: 1,
      category: 'technology'
    },
    {
      text: 'データベース',
      romaji: 'de-tabe-su',
      level: 2,
      category: 'technology'
    }
    // 必要なだけ追加できます
  ]

  for (const word of words) {
    await prisma.word.create({
      data: word
    })
  }

  console.log('シードデータが正常に作成されました')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })