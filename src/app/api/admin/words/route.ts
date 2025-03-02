import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Word } from "@/app/_types/Word";

// タイピングゲームに登場する新たな単語を登録するAPI
export const POST = async (req: NextRequest) => {
    try {
        const body = await req.json();
        const word = await prisma.word.create({
        data: {
            ...body,
            level: Number(body.level),
        },
        });
        return NextResponse.json(word);
    } catch (error) {
        console.error('Error creating word:', error);
        return NextResponse.json(
            { error: 'Failed to create word' },
            { status: 500 }
        );
    }
}
