import React, { useState, useEffect } from "react";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x4DE413d3519c137576Da408ff18c9d2AA3e81D9F";
const CONTRACT_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
  "function mint(address to, uint256 amount) external",
  "function burn(uint256 amount) external",
  "function owner() view returns (address)",
  "function transfer(address to, uint256 amount) external returns (bool)",
];

function AdminPanel({ darkMode, account }) {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mintAddress, setMintAddress] = useState("");
  const [mintAmount, setMintAmount] = useState("");
  const [burnAmount, setBurnAmount] = useState("");
  const [transferAddress, setTransferAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const [tokenName, setTokenName] = useState("");
  const [totalSupply, setTotalSupply] = useState("0");
  const [balance, setBalance] = useState("0");
  const [activeTab, setActiveTab] = useState("transfer");
  const [isProcessing, setIsProcessing] = useState(false);

  const initContract = async (address) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      setContract(contract);
      
      const name = await contract.name();
      setTokenName(name);
      
      const supply = await contract.totalSupply();
      setTotalSupply(ethers.formatUnits(supply, 18));
      
      const bal = await contract.balanceOf(address);
      setBalance(ethers.formatUnits(bal, 18));
      
      setLoading(false);
      setMessage({ text: "✅ پنل مدیریت با موفقیت بارگذاری شد", type: "success" });
      setTimeout(() => setMessage({ text: "", type: "" }), 4000);
    } catch (error) {
      console.error("Error initializing contract:", error);
      setLoading(false);
      setMessage({ text: "❌ خطا در بارگذاری پنل", type: "error" });
    }
  };

  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  const handleMint = async (e) => {
    e.preventDefault();
    if (!mintAddress || !mintAmount) {
      showMessage("❌ لطفاً آدرس و مقدار را وارد کنید", "error");
      return;
    }
    setIsProcessing(true);
    try {
      const amount = ethers.parseUnits(mintAmount, 18);
      const tx = await contract.mint(mintAddress, amount);
      showMessage("⏳ در حال پردازش تراکنش...", "info");
      await tx.wait();
      showMessage(`✅ ${mintAmount} ABCO با موفقیت ارسال شد!`, "success");
      const supply = await contract.totalSupply();
      setTotalSupply(ethers.formatUnits(supply, 18));
      const bal = await contract.balanceOf(account);
      setBalance(ethers.formatUnits(bal, 18));
      setMintAddress("");
      setMintAmount("");
    } catch (error) {
      showMessage(`❌ خطا: ${error.message.slice(0, 100)}`, "error");
    }
    setIsProcessing(false);
  };

  const handleBurn = async (e) => {
    e.preventDefault();
    if (!burnAmount) {
      showMessage("❌ لطفاً مقدار را وارد کنید", "error");
      return;
    }
    setIsProcessing(true);
    try {
      const amount = ethers.parseUnits(burnAmount, 18);
      const tx = await contract.burn(amount);
      showMessage("⏳ در حال پردازش تراکنش...", "info");
      await tx.wait();
      showMessage(`✅ ${burnAmount} ABCO با موفقیت سوزانده شد!`, "success");
      const supply = await contract.totalSupply();
      setTotalSupply(ethers.formatUnits(supply, 18));
      const bal = await contract.balanceOf(account);
      setBalance(ethers.formatUnits(bal, 18));
      setBurnAmount("");
    } catch (error) {
      showMessage(`❌ خطا: ${error.message.slice(0, 100)}`, "error");
    }
    setIsProcessing(false);
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!transferAddress || !transferAmount) {
      showMessage("❌ لطفاً آدرس و مقدار را وارد کنید", "error");
      return;
    }
    setIsProcessing(true);
    try {
      const amount = ethers.parseUnits(transferAmount, 18);
      const tx = await contract.transfer(transferAddress, amount);
      showMessage("⏳ در حال پردازش تراکنش...", "info");
      await tx.wait();
      showMessage(`✅ ${transferAmount} ABCO با موفقیت ارسال شد!`, "success");
      const bal = await contract.balanceOf(account);
      setBalance(ethers.formatUnits(bal, 18));
      setTransferAddress("");
      setTransferAmount("");
    } catch (error) {
      showMessage(`❌ خطا: ${error.message.slice(0, 100)}`, "error");
    }
    setIsProcessing(false);
  };

  useEffect(() => {
    if (account) {
      initContract(account);
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
      {message.text && (
        <div className={`fixed top-24 right-6 z-50 max-w-md w-full shadow-xl rounded-2xl overflow-hidden border animate-slide-down ${
          message.type === "success" 
            ? darkMode ? "bg-green-900/30 border-green-700" : "bg-green-50 border-green-200"
            : message.type === "error"
            ? darkMode ? "bg-red-900/30 border-red-700" : "bg-red-50 border-red-200"
            : darkMode ? "bg-blue-900/30 border-blue-700" : "bg-blue-50 border-blue-200"
        }`}>
          <div className={`p-4 flex items-center gap-3 ${
            message.type === "success" 
              ? darkMode ? "text-green-400" : "text-green-700"
              : message.type === "error"
              ? darkMode ? "text-red-400" : "text-red-700"
              : darkMode ? "text-blue-400" : "text-blue-700"
          }`}>
            <span className="text-2xl">
              {message.type === "success" ? "✅" : message.type === "error" ? "❌" : "⏳"}
            </span>
            <p className="flex-1">{message.text}</p>
            <button 
              onClick={() => setMessage({ text: "", type: "" })} 
              className={darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}
            >✕</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className={`rounded-2xl shadow-sm p-5 border transition-colors duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
          <p className={`text-sm transition-colors duration-300 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>عرضه کل</p>
          <p className={`text-2xl font-bold transition-colors duration-300 ${darkMode ? "text-white" : "text-gray-800"}`}>
            {Number(totalSupply).toFixed(4)} <span className="text-sm font-normal text-gray-400">ABCO</span>
          </p>
        </div>
        <div className={`rounded-2xl shadow-sm p-5 border transition-colors duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
          <p className={`text-sm transition-colors duration-300 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>موجودی شما</p>
          <p className={`text-2xl font-bold transition-colors duration-300 ${darkMode ? "text-white" : "text-gray-800"}`}>
            {Number(balance).toFixed(4)} <span className="text-sm font-normal text-gray-400">ABCO</span>
          </p>
        </div>
        <div className={`rounded-2xl shadow-sm p-5 border transition-colors duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
          <p className={`text-sm transition-colors duration-300 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>وضعیت</p>
          <p className="text-lg font-bold text-green-600 flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
            فعال
          </p>
        </div>
      </div>

      <div className={`rounded-2xl shadow-sm border overflow-hidden transition-colors duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
        <div className={`flex flex-wrap border-b transition-colors duration-300 ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
          {[
            { id: "transfer", label: "📤 ارسال", color: "blue" },
            { id: "mint", label: "🪙 ضرب", color: "green" },
            { id: "burn", label: "🔥 سوزاندن", color: "red" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-medium transition-all duration-200 border-b-2 ${
                activeTab === tab.id
                  ? `border-${tab.color}-500 text-${tab.color}-600 dark:text-${tab.color}-400`
                  : `border-transparent hover:border-gray-300 ${darkMode ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700"}`
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === "transfer" && (
            <form onSubmit={handleTransfer} className="space-y-5 max-w-lg">
              <div>
                <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>آدرس گیرنده</label>
                <input
                  type="text"
                  value={transferAddress}
                  onChange={(e) => setTransferAddress(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 text-sm font-mono ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500" : "bg-gray-50 border-gray-200 focus:border-blue-500"} focus:outline-none`}
                  placeholder="0x..."
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>مقدار (ABCO)</label>
                <input
                  type="number"
                  step="0.01"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-blue-500" : "bg-gray-50 border-gray-200 focus:border-blue-500"} focus:outline-none`}
                  placeholder="مثلاً 100"
                />
                <p className={`text-xs mt-1 transition-colors duration-300 ${darkMode ? "text-gray-400" : "text-gray-400"}`}>موجودی قابل استفاده: {Number(balance).toFixed(4)} ABCO</p>
              </div>
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-200 shadow-md shadow-blue-500/20 hover:shadow-blue-500/40 disabled:opacity-50"
              >
                {isProcessing ? "⏳ در حال پردازش..." : "📤 ارسال توکن"}
              </button>
            </form>
          )}

          {activeTab === "mint" && (
            <form onSubmit={handleMint} className="space-y-5 max-w-lg">
              <div className={`rounded-xl p-3 text-sm border ${darkMode ? "bg-blue-900/20 border-blue-800 text-blue-400" : "bg-blue-50 border-blue-200 text-blue-700"}`}>
                ⚠️ ضرب توکن جدید، عرضه کل را افزایش می‌دهد.
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>آدرس گیرنده</label>
                <input
                  type="text"
                  value={mintAddress}
                  onChange={(e) => setMintAddress(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 text-sm font-mono ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-green-500" : "bg-gray-50 border-gray-200 focus:border-green-500"} focus:outline-none`}
                  placeholder="0x..."
                />
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>مقدار (ABCO)</label>
                <input
                  type="number"
                  step="0.01"
                  value={mintAmount}
                  onChange={(e) => setMintAmount(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-green-500" : "bg-gray-50 border-gray-200 focus:border-green-500"} focus:outline-none`}
                  placeholder="مثلاً 1000"
                />
              </div>
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all duration-200 shadow-md shadow-green-500/20 hover:shadow-green-500/40 disabled:opacity-50"
              >
                {isProcessing ? "⏳ در حال پردازش..." : "🪙 ضرب توکن"}
              </button>
            </form>
          )}

          {activeTab === "burn" && (
            <form onSubmit={handleBurn} className="space-y-5 max-w-lg">
              <div className={`rounded-xl p-3 text-sm border ${darkMode ? "bg-red-900/20 border-red-800 text-red-400" : "bg-red-50 border-red-200 text-red-700"}`}>
                ⚠️ سوزاندن توکن برگشت‌ناپذیر است.
              </div>
              <div>
                <label className={`block text-sm font-medium mb-1 transition-colors duration-300 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>مقدار (ABCO)</label>
                <input
                  type="number"
                  step="0.01"
                  value={burnAmount}
                  onChange={(e) => setBurnAmount(e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border transition-all duration-200 ${darkMode ? "bg-gray-700 border-gray-600 text-white focus:border-red-500" : "bg-gray-50 border-gray-200 focus:border-red-500"} focus:outline-none`}
                  placeholder="مثلاً 500"
                />
                <p className={`text-xs mt-1 transition-colors duration-300 ${darkMode ? "text-gray-400" : "text-gray-400"}`}>موجودی قابل استفاده: {Number(balance).toFixed(4)} ABCO</p>
              </div>
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-200 shadow-md shadow-red-500/20 hover:shadow-red-500/40 disabled:opacity-50"
              >
                {isProcessing ? "⏳ در حال پردازش..." : "🔥 سوزاندن"}
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className={`rounded-2xl shadow-sm p-4 border flex items-center gap-3 transition-colors duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>📋</div>
          <div>
            <p className={`text-xs transition-colors duration-300 ${darkMode ? "text-gray-400" : "text-gray-400"}`}>آخرین تراکنش</p>
            <p className={`text-sm transition-colors duration-300 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>--</p>
          </div>
        </div>
        <div className={`rounded-2xl shadow-sm p-4 border flex items-center gap-3 transition-colors duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>⛓️</div>
          <div>
            <p className={`text-xs transition-colors duration-300 ${darkMode ? "text-gray-400" : "text-gray-400"}`}>شبکه</p>
            <p className={`text-sm font-bold transition-colors duration-300 ${darkMode ? "text-white" : "text-gray-700"}`}>BSC Testnet</p>
          </div>
        </div>
        <div className={`rounded-2xl shadow-sm p-4 border flex items-center gap-3 transition-colors duration-300 ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"}`}>
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>🏷️</div>
          <div>
            <p className={`text-xs transition-colors duration-300 ${darkMode ? "text-gray-400" : "text-gray-400"}`}>قرارداد</p>
            <p className={`text-sm font-mono transition-colors duration-300 ${darkMode ? "text-gray-300" : "text-gray-700"}`}>
              {CONTRACT_ADDRESS.slice(0, 12)}...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;