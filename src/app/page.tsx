'use client';

import { useState, useEffect, useRef, use } from "react";
import type { Word } from "./_types/Word";
import { auth, db } from "@/lib/firebaseConfig";
import { onAuthStateChanged, User } from "firebase/auth";
import { saveGameResults } from "./_utils/saveGameResults";
import { GameResult } from "./_types/GameResult";

export default function Home() {
  const [word, setWord] = useState<Word>({ id: '', text: '', romaji: '', level: 0, category: '' });
  const [time, setTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [input, setInput] = useState('');
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isCorrectSoFar, setIsCorrectSoFar] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  // ログイン状態を監視
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // ランダムな単語を一つ取得
  const fetchWord = async () => {
    try {
      const response = await fetch('/api/words');
      const data = await response.json();

      // APIのレスポンス構造を確認
      console.log('API response:', data);

      // APIレスポンスがそのままWordオブジェクトの場合
      if (data.id !== undefined) {
        setWord(data);
      }
      // APIレスポンスがdata.textにWordオブジェクトを含む場合
      else if (data.text && typeof data.text === 'object') {
        setWord(data.text);
      }
      // それ以外の場合はエラーログを出力
      else {
        console.error('Unexpected API response format:', data);
      }
    } catch (error) {
      console.error('Error fetching word:', error);
    }
  }

  // 入力をハンドルする
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);

    // 入力途中のチェック
    if (word.romaji.startsWith(value)) {
      setIsCorrectSoFar(true);
    } else {
      setIsCorrectSoFar(false);
    }

    // 入力した単語が正しいか判定
    if (value === word.romaji) {
      // スコアを更新
      setScore(prevScore => prevScore + 1);
      // 入力フィールドをクリア
      setInput('');
      // 次の単語を取得
      fetchWord();
      // 正解状態をリセット
      setIsCorrectSoFar(true);
    }
  };

  // スタートボタンをクリックしたときの処理
  const handleStart = () => {
    // スコアをリセット
    setScore(0);
    setInput('');
    setIsCorrectSoFar(true);

    // 最初の単語を取得
    fetchWord();

    // タイマー開始
    setIsPlaying(true);
    setTime(0);

    const intervalTimer = setInterval(() => {
      setTime(prevTime => prevTime + 1);
    }, 1000);

    setTimer(intervalTimer);

    // 入力フィールドにフォーカス
    if (inputRef.current) inputRef.current.focus();
  }

  // ゲームを終了する
  const handleStop = () => {
    setIsPlaying(false);
    if (timer) clearInterval(timer);
    setTimer(null);

    if(user) {
      const result : GameResult = {
        wordsTyped: score,
        duration: time,
        wpm: score / (time / 60)
      };
      saveGameResults(user.uid, result);
    }
  }

  // タイマーが60秒経過したらゲームを終了
  useEffect(() => {
    if (time >= 60) {
      handleStop();
    }
  }, [time]);

  // ゲーム終了時のクリーンアップ
  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-2xl font-bold mb-4">タイピングゲーム</h1>

      <div className="mb-4">
        <p>制限時間: {isPlaying ? 60 - time : 60}秒</p>
        <p>スコア: {score}単語</p>
      </div>

      {!isPlaying ? (
        <button
          onClick={handleStart}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          スタート
        </button>
      ) : (
        <div className="space-y-4">
          <div
            className="p-4 bg-gray-100 rounded transition-all duration-300 transform animate-fade-in"
            key={word.id} // キーを追加して単語が変わるたびに要素が再レンダリングされるようにする
          >
            <p className="mb-2">次の単語を入力してください:</p>
            <p className="text-xl font-bold animate-bounce-in">{word.text}</p>
            <p className="text-sm text-gray-500">{word.romaji}</p>
          </div>

          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            className={`w-full p-2 border rounded transition-colors duration-300 ${input.length > 0
                ? (isCorrectSoFar ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50')
                : 'border-gray-300'
              }`}
            autoFocus
          />

          <button
            onClick={handleStop}
            className="bg-red-500 text-white px-4 py-2 rounded"
          >
            終了
          </button>
        </div>
      )}

      {!isPlaying && time > 0 && (
        <div className="mt-4 p-4 bg-green-100 rounded">
          <h2 className="text-xl font-bold">結果</h2>
          <p>60秒間で{score}単語入力できました！</p>
          <p>平均: {(score / (time / 60)).toFixed(1)}単語/分</p>
        </div>
      )}

      <style jsx global>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(-10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes bounceIn {
        0% { transform: scale(0.8); opacity: 0; }
        70% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); }
      }
      .animate-fade-in {
        animation: fadeIn 0.3s ease-out;
      }
      .animate-bounce-in {
        animation: bounceIn 0.4s ease-out;
      }
      `}</style>
    </div>
  );
}