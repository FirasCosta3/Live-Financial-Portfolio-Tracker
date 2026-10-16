import {PieChart} from './components/Pie.jsx';
import {useState, useEffect} from 'react'
import './App.css';
import {Currency_buttons} from './components/currencies.jsx';

function App() {
        const [portfolioData, SetPortfolioData] = useState(null)
        const [showCurrencies, setCurrencies] = useState(false);
        const [menuActive, setMenuActive] = useState(false)
        const [stockSearch, setStockSearch] = useState("")
        const [foundStocks, setFoundStocks] = useState([])
        const [currency, currencySet] = useState(() => {
            const saved = localStorage.getItem("currency")
            return saved ? saved : "GBP";
        });
        const [chartSymbol, setChartSymbol] = useState(() => {
            const saved = localStorage.getItem("symbol")
            return saved? saved : "£"
        })

        const sendPortfolioData = async (selectedCurrency) => {
            const response = await fetch("http://127.0.0.1:5000/portfolio", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    currency: selectedCurrency
                })
            });
            const data = await response.json();
            if (data.status === 200) {
                SetPortfolioData(data.data)
                setChartSymbol(localStorage.getItem("symbol") || "£" )
        };
        }
        useEffect(() => {
            localStorage.setItem("currency", currency)
            sendPortfolioData(currency);
        }, [currency])
    function saveCurrency(name, symbol){
        localStorage.setItem("currency", name)
        localStorage.setItem("symbol", symbol)
        currencySet(name)
        setCurrencies(false)
    }

    const findStock = async (e) => {
        e.preventDefault();
        const response = await fetch("http://127.0.0.1:5000/stocks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                search: stockSearch
            })
        });
        const data = await response.json();
        if (data.status === 200){
            setFoundStocks(data.data)
        }

    }

    const currency_cur = localStorage.getItem("currency") || "GBP"
    const currency_symb = localStorage.getItem("symbol") || "£"

    return (
        <>
    <nav id="top-nav">
        <div id="cur-div">
            <button className="main-font currency-button" id="current-currency" onClick={() => setCurrencies(!showCurrencies)}>{currency_cur} {currency_symb}</button>
            <Currency_buttons curClass={showCurrencies ? "currencies active" : "currencies"} currentPick={saveCurrency}/>
        </div>
    </nav>
    <div className="pie-chart">
        <button id="new-stock" className={"main-font"} onClick={() => setMenuActive(!menuActive)}>+ New stock</button>
        <PieChart symbol = {chartSymbol} portfolio={portfolioData}/>
    </div>
    <div className={menuActive ? "stock-buy active" : "stock-buy"}>
        <div id="search-div">
            <form id="stock-search-form" onSubmit={findStock}>
                <input autocomplete="off" onChange={(e) => setStockSearch(e.target.value)} id="stock-search" placeholder="Enter a stock or ticker" type="text"></input>
            </form>
                {foundStocks?.map((stock, index) => {
                    return (
                        <div key={index} className="search-button-div">
                            <button type="button" className="search-buttons">{stock}</button>
                        </div>
                    );
            })}
            </div>
    </div>
        </>
        );
}
export default App;

