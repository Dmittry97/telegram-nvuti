"use client";

import { useEffect, useMemo, useState } from "react";
import { BetDirection } from "@shared/core";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type CheckData = {
  salt1: string;
  salt2: string;
  number: number;
  hash: string;
};

const sampleGames = [
  { login: "Pat...", number: 700844, target: "990000 - 999999", amount: 1, chance: 1, win: 0 },
  { login: "Nat...", number: 563922, target: "964000 - 999999", amount: 1, chance: 3.6, win: 0 },
  { login: "Oksima1...", number: 935051, target: "0 - 89999", amount: 9, chance: 9, win: 0 },
  { login: "Pat...", number: 911988, target: "0 - 9999", amount: 1, chance: 1, win: 0 }
];

export default function HomePage() {
  const [betSize, setBetSize] = useState(1);
  const [betPercent, setBetPercent] = useState(90);
  const [hash, setHash] = useState(
    "1e47698bc3d6904105c1d8f89b8a65f84cbb2ef7ef6fd7dd08dfd29b9c6e5e55a7225d9cd0fc3a2443a54a73d64f9b0fe0fe9c330ae5f345bcd858ed82182768"
  );
  const [lastBetId, setLastBetId] = useState<string | null>(null);
  const [balance, setBalance] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [checkData, setCheckData] = useState<CheckData | null>(null);
  const [showCheck, setShowCheck] = useState(false);

  const profit = useMemo(() => Number(((100 / betPercent) * betSize).toFixed(2)), [betSize, betPercent]);
  const minRange = useMemo(() => Math.floor((betPercent / 100) * 999999), [betPercent]);
  const maxRange = useMemo(() => 999999 - minRange, [minRange]);

  useEffect(() => {
    if (typeof window !== "undefined" && (window as any).Telegram?.WebApp) {
      (window as any).Telegram.WebApp.ready();
      (window as any).Telegram.WebApp.expand();
    }
  }, []);

  const updateBetSize = (value: number) => {
    if (Number.isNaN(value)) return;
    setBetSize(Math.max(0.01, Number(value.toFixed(2))));
  };

  const updateBetPercent = (value: number) => {
    if (Number.isNaN(value)) return;
    setBetPercent(Math.min(95, Math.max(1, Number(value.toFixed(2)))));
  };

  const handleBet = async (direction: BetDirection) => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/bets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-user-id": "demo-user"
        },
        body: JSON.stringify({ betSize, betPercent, direction })
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error.text || "Ошибка");
        return;
      }
      const successData = data.success;
      if (successData) {
        setHash(successData.hash);
        setLastBetId(successData.check_bet);
        setBalance(successData.new_balance);
        setCheckData({
          salt1: successData.html.salt1,
          salt2: successData.html.salt2,
          number: successData.html.number,
          hash: successData.html.hash
        });
        if (successData.type === "win") {
          setSuccess(`Выиграли ${successData.profit.toFixed ? successData.profit.toFixed(2) : successData.profit}`);
        } else {
          setError(`Выпало ${successData.number}`);
        }
      }
    } catch (e) {
      setError("Не удалось сделать ставку");
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = async () => {
    if (!lastBetId) return;
    try {
      const res = await fetch(`${API_URL}/bets/${lastBetId}`, {
        headers: { "x-user-id": "demo-user" }
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error.text);
        return;
      }
      setCheckData({
        salt1: data.salt1,
        salt2: data.salt2,
        number: data.number,
        hash: data.hash
      });
      setShowCheck(true);
    } catch (e) {
      setError("Не удалось проверить игру");
    }
  };

  return (
    <main className="page">
      <div className="header">
        <div>
          <h1>Режим игры</h1>
          <p className="subtitle">Мини-апп для Telegram с честной проверкой SHA-512</p>
        </div>
        <button className="primary" onClick={() => alert("Авторизация WebApp Telegram")}>
          Авторизоваться
        </button>
      </div>

      <section className="card">
        <div className="card-head">
          <h2>Игра</h2>
          <span className="pill success">Баланс: {balance.toFixed(2)}</span>
        </div>

        <div className="tabs">
          <button className="tab active">Main game</button>
          <button className="tab disabled">Classic</button>
          <button className="tab disabled">Tower</button>
        </div>

        <div className="grid">
          <div className="column">
            <div className="profit-box">
              <div className="profit-value">{profit.toFixed(2)}</div>
              <div className="muted">Возможный выигрыш</div>
            </div>

            <div className="inputs">
              <label className="input-block">
                <span>Сумма</span>
                <input
                  value={betSize}
                  onChange={(e) => updateBetSize(Number(e.target.value))}
                  inputMode="decimal"
                  pattern="[0-9]*"
                />
              </label>
              <div className="inline-buttons">
                <button onClick={() => updateBetSize(betSize * 2)}>Удвоить</button>
                <button onClick={() => updateBetSize(Math.max(betSize / 2, 1))}>Половина</button>
              </div>
              <div className="inline-buttons">
                <button onClick={() => updateBetSize(balance)}>Макс</button>
                <button onClick={() => updateBetSize(1)}>Мин</button>
              </div>
            </div>

            <div className="inputs">
              <label className="input-block">
                <span>Процент</span>
                <input
                  value={betPercent}
                  onChange={(e) => updateBetPercent(Number(e.target.value))}
                  inputMode="decimal"
                  pattern="[0-9]*"
                />
              </label>
              <div className="inline-buttons">
                <button onClick={() => updateBetPercent(Math.min(betPercent * 2, 95))}>Удвоить</button>
                <button onClick={() => updateBetPercent(Math.max(betPercent / 2, 1))}>Половина</button>
              </div>
              <div className="inline-buttons">
                <button onClick={() => updateBetPercent(95)}>Макс</button>
                <button onClick={() => updateBetPercent(1)}>Мин</button>
              </div>
            </div>

            <div className="hash-box">
              <span className="muted">Hash игры:</span>
              <div className="hash-value">{hash}</div>
            </div>
          </div>

          <div className="column">
            <div className="profit-box secondary">
              <div className="profit-value">{profit.toFixed(2)}</div>
              <div className="muted">Возможный выигрыш</div>
            </div>

            <div className="range-row">
              <div className="range">
                <div className="muted">0 - {minRange}</div>
                <button className="primary" disabled={loading} onClick={() => handleBet("min")}>
                  Меньше
                </button>
              </div>
              <div className="range">
                <div className="muted">
                  {maxRange} - 999999
                </div>
                <button className="primary" disabled={loading} onClick={() => handleBet("max")}>
                  Больше
                </button>
              </div>
            </div>

            <div className="messages">
              {loading && <div className="loader">Ставка...</div>}
              {success && <div className="alert success">{success}</div>}
              {error && <div className="alert danger">{error}</div>}
            </div>

            <div className="check-row">
              <button className="ghost" disabled={!lastBetId} onClick={handleCheck}>
                Проверить игру
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h2>Последние игры</h2>
          <div className="online">
            <span className="pulse" />
            <span>93</span>
          </div>
        </div>
        <div className="table">
          <div className="table-head">
            <span>Логин</span>
            <span>Число</span>
            <span>Цель</span>
            <span>Сумма</span>
            <span>Шанс</span>
            <span>Выигрыш</span>
          </div>
          {sampleGames.map((g, idx) => (
            <div key={idx} className="table-row">
              <span>{g.login}</span>
              <span className="danger">{g.number}</span>
              <span>{g.target}</span>
              <span>{g.amount.toFixed(2)}</span>
              <span>
                <div className="progress">
                  <div className="bar" style={{ width: `${g.chance}%` }} />
                </div>
              </span>
              <span className="danger">{g.win.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2>Как проверить честность</h2>
        <p className="muted">
          Перед каждой игрой генерируется SHA-512 строка с солью и победным числом (0–999999). Скопируйте hash,
          сделайте ставку, затем нажмите «Проверить игру» и вставьте Salt1|Number|Salt2 в любой SHA-512 генератор
          — результат должен совпасть.
        </p>
        <div className="example">
          <div>Hash до игры:</div>
          <code>cdbe74ade59f5b8e3372c1e107ca8d343da9efa1a173ba6bc678daa28b586b25a7c2e39a71badf7f00e04b5c1dbc43532b92a1f2913b0540f490968d7ce883fe</code>
          <div>Строка для проверки:</div>
          <code>8{{"{"}}93mW8huq|995544|a5cm28bjA0</code>
        </div>
      </section>

      {showCheck && checkData && (
        <div className="modal">
          <div className="modal-content">
            <button className="close" onClick={() => setShowCheck(false)}>
              ×
            </button>
            <h3>Проверка игры</h3>
            <div className="check-grid">
              <label>
                <span>Salt1</span>
                <input readOnly value={checkData.salt1} />
              </label>
              <label>
                <span>Number</span>
                <input readOnly value={checkData.number} />
              </label>
              <label>
                <span>Salt2</span>
                <input readOnly value={checkData.salt2} />
              </label>
              <label>
                <span>Hash</span>
                <input readOnly value={checkData.hash} />
              </label>
            </div>
            <div className="inline-buttons">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `${checkData.salt1}|${checkData.number}|${checkData.salt2}`
                  );
                }}
              >
                Скопировать строку
              </button>
              <button onClick={() => navigator.clipboard.writeText(checkData.hash)}>Скопировать hash</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
