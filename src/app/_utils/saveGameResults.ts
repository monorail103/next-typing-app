import { doc, updateDoc, collection, addDoc, increment, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { GameResult } from '@/app/_types/GameResult';

export async function saveGameResults(userId: string, result: GameResult) {
  try {
    // ユーザードキュメントの更新
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      totalWords: increment(result.wordsTyped),
      // 最高スコアを更新（必要に応じて）
      bestScore: result.wpm > 0 ? result.wpm : 0,
      // 他のフィールドも必要に応じて更新
    });

    // プレイセッションを追加
    const sessionRef = collection(db, 'users', userId, 'sessions');
    await addDoc(sessionRef, {
      date: serverTimestamp(),
      duration: result.duration,
      wordsTyped: result.wordsTyped,
      wpm: result.wpm
    });

    return { success: true };
  } catch (error) {
    console.error('Error saving game results:', error);
    return { success: false, error };
  }
}