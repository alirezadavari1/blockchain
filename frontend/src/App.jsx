import React, { useState, useEffect } from "react";
import Dashboard from "./components/Dashboard";
import AdminPanel from "./components/AdminPanel";

const ALLOWED_ADMIN_ADDRESS = "0x6c4D04111601DD57b727DC471Dcf342d40d1E624";

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [account, setAccount] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        setIsConnecting(true);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const isAdminAccount = accounts[0].toLowerCase() === ALLOWED_ADMIN_ADDRESS.toLowerCase();
          setIsAdmin(isAdminAccount);
          if (isAdminAccount) {
            setShowAdmin(true);
          } else {
            setShowAdmin(false);
          }
        }
        setIsConnecting(false);
      } catch (error) {
        console.error("Error connecting to MetaMask:", error);
        setIsConnecting(false);
      }
    } else {
      alert("لطفاً متامسک را نصب کنید!");
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsAdmin(false);
    setShowAdmin(false);
    if (window.ethereum) {
      window.ethereum.request({
        method: "wallet_revokePermissions",
        params: [{ eth_accounts: {} }]
      }).catch(() => {});
    }
  };

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            setAccount(accounts[0]);
            const isAdminAccount = accounts[0].toLowerCase() === ALLOWED_ADMIN_ADDRESS.toLowerCase();
            setIsAdmin(isAdminAccount);
            if (isAdminAccount) {
              setShowAdmin(true);
            }
          } else {
            setAccount(null);
            setIsAdmin(false);
            setShowAdmin(false);
          }
        } catch (error) {
          console.error("Error checking connection:", error);
        }
      }
      setIsLoading(false);
    };
    checkConnection();

    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const isAdminAccount = accounts[0].toLowerCase() === ALLOWED_ADMIN_ADDRESS.toLowerCase();
          setIsAdmin(isAdminAccount);
          if (isAdminAccount) {
            setShowAdmin(true);
          } else {
            setShowAdmin(false);
          }
        } else {
          setAccount(null);
          setIsAdmin(false);
          setShowAdmin(false);
        }
      };
      window.ethereum.on("accountsChanged", handleAccountsChanged);
      
      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
      };
    }
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f0f2f5] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? "bg-gray-900 text-gray-100" : "bg-[#f0f2f5] text-gray-800"
    }`}>
      <nav className={`sticky top-0 z-50 border-b transition-colors duration-300 ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      } shadow-sm`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <a 
              href="#" 
              className="flex items-center gap-3 hover:opacity-80 transition-opacity duration-200"
            >
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-500/20">
                A
              </div>
              <div>
                <h1 className={`text-xl font-bold transition-colors duration-300 ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}>
                  آبان کپیتال
                </h1>
                <p className={`text-xs -mt-0.5 transition-colors duration-300 ${
                  darkMode ? "text-gray-400" : "text-gray-400"
                }`}>
                  مدیریت توکن
                </p>
              </div>
            </a>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-xl transition-all duration-200 ${
                  darkMode 
                    ? "bg-gray-700 text-yellow-400 hover:bg-gray-600" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {darkMode ? "☀️" : "🌙"}
              </button>

              {account && (
                <>
                  <button
                    onClick={() => setShowAdmin(false)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 text-sm ${
                      !showAdmin
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                        : darkMode
                        ? "text-gray-300 hover:bg-gray-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    داشبورد
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => setShowAdmin(true)}
                      className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 text-sm ${
                        showAdmin
                          ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
                          : darkMode
                          ? "text-gray-300 hover:bg-gray-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                       مدیریت
                    </button>
                  )}
                </>
              )}

              {!account ? (
                <button
                  onClick={connectWallet}
                  disabled={isConnecting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all duration-200 shadow-md shadow-blue-500/20 text-sm disabled:opacity-50"
                >
                  {isConnecting ? "⏳ در حال اتصال..." : "🔗 اتصال کیف پول"}
                </button>
              ) : (
                <>
                  <span className={`text-sm font-mono px-3 py-1.5 rounded-xl transition-colors duration-300 ${
                    darkMode ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-600"
                  }`}>
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </span>
                  <button
                    onClick={disconnectWallet}
                    className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-sm font-medium rounded-xl transition-all duration-200"
                  >
                    خروج
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {!account ? (
          <div className={`rounded-3xl shadow-xl p-12 text-center max-w-2xl mx-auto border transition-colors duration-300 ${
            darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"
          }`}>
            <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl flex items-center justify-center text-6xl mx-auto mb-6 shadow-xl shadow-blue-500/20">
              🔗
            </div>
            <h2 className={`text-2xl font-bold mb-3 transition-colors duration-300 ${
              darkMode ? "text-white" : "text-gray-800"
            }`}>
              به آبان کپیتال خوش آمدید
            </h2>
            <p className={`text-sm mb-8 transition-colors duration-300 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}>
              برای شروع، کیف پول خود را متصل کنید
            </p>
            <button
              onClick={connectWallet}
              disabled={isConnecting}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold rounded-2xl transition-all duration-200 shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 transform hover:scale-[1.02] disabled:opacity-50"
            >
              {isConnecting ? "⏳ در حال اتصال..." : "🔗 اتصال متامسک"}
            </button>
          </div>
        ) : (
          <>
            {showAdmin && isAdmin ? (
              <AdminPanel darkMode={darkMode} account={account} />
            ) : (
              <Dashboard darkMode={darkMode} account={account} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;