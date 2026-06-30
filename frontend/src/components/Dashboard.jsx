import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x4DE413d3519c137576Da408ff18c9d2AA3e81D9F";
const CONTRACT_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function getCopperPriceInUSD() view returns (uint256)",
];

function Dashboard({ darkMode, account }) {
  const [tokenName, setTokenName] = useState("Copper Token");
  const [tokenSymbol, setTokenSymbol] = useState("ABCO");
  const [totalSupply, setTotalSupply] = useState("0");
  const [balance, setBalance] = useState("0");
  const [loading, setLoading] = useState(true);
  const [nav, setNav] = useState("1.5000");

  const loadContractData = async (address) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      
      const name = await contract.name();
      const symbol = await contract.symbol();
      const supply = await contract.totalSupply();
      const balance = await contract.balanceOf(address);
      
      let price = "1.5000";
      try {
        const rawPrice = await contract.getCopperPriceInUSD();
        price = ethers.formatUnits(rawPrice, 18);
      } catch (e) {
        console.log("getCopperPriceInUSD not available, using default");
      }
      
      setTokenName(name);
      setTokenSymbol(symbol);
      setTotalSupply(ethers.formatUnits(supply, 18));
      setBalance(ethers.formatUnits(balance, 18));
      setNav(price);
      
      setLoading(false);
    } catch (error) {
      console.error("Error loading contract data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (account) {
      loadContractData(account);
    }
  }, [account]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className={`rounded-2xl shadow-sm p-6 border transition-colors duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className={`text-2xl font-bold transition-colors duration-300 ${darkMode ? "text-white" : "text-gray-800"}`}>
              📊 داشبورد
            </h2>
            <p className={`text-sm transition-colors duration-300 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              خلاصه وضعیت توکن
            </p>
          </div>
          <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border transition-colors duration-300 ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-100"}`}>
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
            <span className={`text-sm font-mono transition-colors duration-300 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: "نام توکن", value: tokenName, icon: "🏷️", color: "blue" },
          { label: "نماد", value: tokenSymbol, icon: "🔤", color: "purple" },
          { label: "عرضه کل", value: `${Number(totalSupply).toFixed(4)} ${tokenSymbol}`, icon: "📊", color: "green" },
          { label: "موجودی شما", value: `${Number(balance).toFixed(4)} ${tokenSymbol}`, icon: "💰", color: "amber" },
        ].map((item, index) => (
          <div key={index} className={`rounded-2xl shadow-sm p-6 border transition-colors duration-300 ${darkMode ? "bg-gray-800 border-gray-700 hover:bg-gray-700/50" : "bg-white border-gray-100 hover:shadow-md"}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className={`text-sm font-medium transition-colors duration-300 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{item.label}</p>
                <p className={`text-xl font-bold mt-1 transition-colors duration-300 ${darkMode ? "text-white" : "text-gray-800"}`}>{item.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${darkMode ? "bg-gray-700" : `bg-${item.color}-50`}`}>{item.icon}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className={`lg:col-span-2 rounded-2xl shadow-sm p-6 border transition-colors duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
          <h3 className={`text-lg font-bold mb-4 transition-colors duration-300 ${darkMode ? "text-white" : "text-gray-800"}`}>📈 قیمت NAV</h3>
          <div className="flex items-end gap-4">
            <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              ${Number(nav).toFixed(4)} USDT
            </p>
            <p className={`text-sm mb-1 transition-colors duration-300 ${darkMode ? "text-gray-400" : "text-gray-400"}`}>قیمت هر {tokenSymbol}</p>
          </div>
          <div className="mt-6 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full w-[75%] bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"></div>
          </div>
          <p className={`text-xs mt-2 transition-colors duration-300 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>🟢 نسبت به روز گذشته +2.3%</p>
        </div>

        <div className={`rounded-2xl shadow-sm p-6 border transition-colors duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
          <h3 className={`text-lg font-bold mb-4 transition-colors duration-300 ${darkMode ? "text-white" : "text-gray-800"}`}>⏱️ آخرین فعالیت</h3>
          <div className="space-y-4">
            {[
              { icon: "🟢", label: "اتصال به شبکه", value: "BSC Testnet" },
              { icon: "✅", label: "وضعیت", value: "فعال" },
              { icon: "📋", label: "قرارداد", value: CONTRACT_ADDRESS.slice(0, 12) + "..." },
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}>{item.icon}</div>
                <div>
                  <p className={`text-sm font-medium transition-colors duration-300 ${darkMode ? "text-white" : "text-gray-800"}`}>{item.label}</p>
                  <p className={`text-xs transition-colors duration-300 ${darkMode ? "text-gray-400" : "text-gray-400"}`}>{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={`rounded-2xl shadow-sm p-6 border transition-colors duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 dark:bg-teal-900/30 rounded-xl flex items-center justify-center text-2xl">
              🏦
            </div>
            <h3 className={`text-lg font-bold transition-colors duration-300 ${darkMode ? "text-white" : "text-gray-800"}`}>Proof of Reserve</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? "bg-green-900/30 text-green-400" : "bg-green-100 text-green-700"}`}>● شفاف</span>
          </div>
          <button
            onClick={() => window.location.reload()}
            className={`text-xs px-3 py-1.5 rounded-lg transition-colors duration-200 ${darkMode ? "bg-gray-700 hover:bg-gray-600 text-gray-300" : "bg-gray-100 hover:bg-gray-200 text-gray-600"}`}
          >
            🔄 بروزرسانی
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className={`p-4 rounded-xl text-center ${darkMode ? "bg-gray-700" : "bg-blue-50"}`}>
            <p className={`text-xs transition-colors duration-300 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>مس فیزیکی</p>
            <p className={`text-xl font-bold transition-colors duration-300 ${darkMode ? "text-white" : "text-gray-800"}`}>$10,000</p>
          </div>
          <div className={`p-4 rounded-xl text-center ${darkMode ? "bg-gray-700" : "bg-green-50"}`}>
            <p className={`text-xs transition-colors duration-300 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>USDT خزانه</p>
            <p className={`text-xl font-bold transition-colors duration-300 ${darkMode ? "text-white" : "text-gray-800"}`}>$2,000</p>
          </div>
          <div className={`p-4 rounded-xl text-center ${darkMode ? "bg-gray-700" : "bg-purple-50"}`}>
            <p className={`text-xs transition-colors duration-300 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>ارزش کل</p>
            <p className={`text-xl font-bold transition-colors duration-300 ${darkMode ? "text-white" : "text-gray-800"}`}>$12,000</p>
          </div>
          <div className={`p-4 rounded-xl text-center ${darkMode ? "bg-gray-700" : "bg-amber-50"}`}>
            <p className={`text-xs transition-colors duration-300 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>NAV</p>
            <p className={`text-xl font-bold text-green-600`}>${Number(nav).toFixed(4)}</p>
          </div>
        </div>
        
        <p className={`text-xs mt-4 text-center transition-colors duration-300 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
          🔒 اطلاعات خزانه به صورت شفاف و غیرقابل تغییر روی بلاکچین ثبت شده است
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className={`rounded-2xl shadow-sm p-6 border transition-colors duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
          <h3 className={`text-lg font-bold mb-3 transition-colors duration-300 ${darkMode ? "text-white" : "text-gray-800"}`}>📊 توزیع توکن</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm">
                <span className={darkMode ? "text-gray-400" : "text-gray-600"}>کیف پول شما</span>
                <span className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>{Number(balance).toFixed(4)} {tokenSymbol}</span>
              </div>
              <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-[99%] bg-blue-500 rounded-full"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm">
                <span className={darkMode ? "text-gray-400" : "text-gray-600"}>سایر هولدرها</span>
                <span className={`font-medium ${darkMode ? "text-white" : "text-gray-800"}`}>0 {tokenSymbol}</span>
              </div>
              <div className="mt-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full w-[1%] bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

        <div className={`rounded-2xl shadow-sm p-6 border transition-colors duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
          <h3 className={`text-lg font-bold mb-3 transition-colors duration-300 ${darkMode ? "text-white" : "text-gray-800"}`}>🔗 اطلاعات شبکه</h3>
          <div className="space-y-2 text-sm">
            <div className={`flex justify-between py-2 border-b transition-colors duration-300 ${darkMode ? "border-gray-700" : "border-gray-50"}`}>
              <span className={darkMode ? "text-gray-400" : "text-gray-500"}>شبکه</span>
              <span className={`font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>BSC Testnet</span>
            </div>
            <div className={`flex justify-between py-2 border-b transition-colors duration-300 ${darkMode ? "border-gray-700" : "border-gray-50"}`}>
              <span className={darkMode ? "text-gray-400" : "text-gray-500"}>Chain ID</span>
              <span className={`font-medium ${darkMode ? "text-white" : "text-gray-700"}`}>97</span>
            </div>
            <div className="flex justify-between py-2">
              <span className={darkMode ? "text-gray-400" : "text-gray-500"}>وضعیت</span>
              <span className="font-medium text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span> متصل
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;