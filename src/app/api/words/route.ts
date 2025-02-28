import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Word } from "@/app/_types/Word";

// ランダムに単語を1つ取得するAPI
export const GET = async (req: NextRequest) => {
  try {
    // URLからクエリパラメータを取得
    const { searchParams } = new URL(req.url);
    const count = Number(searchParams.get('count') || '10');
    const level = searchParams.get('level');
    const category = searchParams.get('category');
    
    // クエリ条件を構築
    let whereClause: any = {};
    
    if (level) {
      whereClause.level = Number(level);
    }
    
    if (category) {
      whereClause.category = category;
    }
    
    // 単語を取得
    const words = await prisma.word.findMany({
      where: whereClause,
      take: count,
      orderBy: {
      // ランダムに取得（PostgreSQL固有の機能）
      // 他のDBを使う場合は変更が必要
      id: 'asc'
      }
    });
    
    // ランダムにソート
    const shuffledWords = words.sort(() => Math.random() - 0.5);

    // 一つ選ぶ
    const randomIndex = Math.floor(Math.random() * shuffledWords.length);
    
    // Word型の形式で返す
    const selectedWord: Word = shuffledWords[randomIndex];
    
    return NextResponse.json(shuffledWords[randomIndex]);
  } catch (error) {
    console.error('Error fetching words:', error);
    return NextResponse.json(
      { error: 'Failed to fetch words' },
      { status: 500 }
    );
  }
}