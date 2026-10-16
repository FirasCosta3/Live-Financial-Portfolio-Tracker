import {PieChart} from './components/Pie.jsx';
import {useState, useEffect} from 'react'
import './App.css';
import {Currency_buttons} from './components/currencies.jsx';

function App() {
        const [portfolioData, setPortfolioData] = useState(null)
        const [showCurrencies, setCurrencies] = useState(false);
        const [menuActive, setMenuActive] = useState(false)
        const [stockSearch, setStockSearch] = useState("")
        const [foundStocks, setFoundStocks] = useState([])
        const [desiredStock, setDesiredStock] = useState("")
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
                setPortfolioData(data.data)
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
        else {
            setFoundStocks([])
        }

    }

    const currency_cur = localStorage.getItem("currency") || "GBP"
    const currency_symb = localStorage.getItem("symbol") || "£"
    const changeSearches = (index) => {
        setFoundStocks([]);
        setDesiredStock(foundStocks[index])
    }
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
        <button id="cancel-button" onClick={() => setMenuActive(!menuActive)}>
            <svg id="x-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="50" height="50">
                <path d="M8.5 8.5 L15.5 15.5 M15.5 8.5 L8.5 15.5" stroke="black" strokeWidth="2" strokeLinecap="round" fill="none"/>
            </svg>
        </button>
        <div id="search-div">
            <form id="stock-search-form" onSubmit={(e) => {findStock(e); setDesiredStock("")}}>
                <input  autoComplete="off" onChange={(e) => setStockSearch(e.target.value)} id="stock-search" placeholder="Enter a stock or ticker" type="text"></input>
            </form>
                {foundStocks?.map((stock, index) => {
                    return (
                        <div key={index} className="search-button-div">
                            <button type="button" className="search-buttons" onClick={() => changeSearches(index)}>{stock}</button>
                        </div>
                    );
                })}
                <div id ="show-desired" className={desiredStock ? "active" : ""}>
                    <h1 id="desired-title" className="main-font">{desiredStock}</h1>
                    <div id="buy-sell-div">
                        <button className="buy-sell">Buy</button>
                        <button className="buy-sell">Sell</button>
                    </div>
                    <div id="stock-details">
                        <p>test</p>
                    </div>
                </div>
            </div>
    </div>
        </>
        );
}
export default App;

