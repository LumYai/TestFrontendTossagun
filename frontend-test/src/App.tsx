import { useState, useEffect } from "react"
import ListGroup from "./components/ListGroup"
import CategoryProducts from "./components/CategoryProducts"

interface Item {
  id: number;
  title: string;
}

interface Product {
  id: number;
  title: string;
  price: number;
}

function App() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [category, setCategory] = useState([])
  const [stateCategory, setStateCategory] = useState<string>()
  const [sortingPrice, setSortingPrice] = useState<string>() // Descending น้อยไปมาก Ascending มากไปน้อย 
  const [cart, setCart] = useState<Product[]>([])
  const [stateStart, setStateStart] = useState(false)

  const fetchProducts = async () => {
    try {
      const fetchDataCategory = await fetch("http://localhost:8000/category")
      if (!fetchDataCategory.ok) {
        throw new Error("response was error")
      }
      const dataCategory = await fetchDataCategory.json()
      const listCategory = dataCategory.map((item: Item) => item.title)
      setCategory(listCategory)
      setStateCategory(category[0])
    } catch (error: any) {
      setError(error.message)
      setLoading(false)
    }
  }

  const handleSelectChange = (value: string) => {
    setStateCategory(value)
  }

  const handleAddToCart = async (product: Product) => {
    console.log("product ", product)
    setLoading(true)
    const ObjectProduct = JSON.parse(JSON.stringify(product))
    if (localStorage.length == 0) {
      await localStorage.setItem("lastId", "1")
      ObjectProduct.id = 1
      await localStorage.setItem("products", JSON.stringify([product]))
      const storedItems = await JSON.parse(localStorage.getItem("products") || "[]")
      setCart(storedItems)
    } else {
      const lastId = await JSON.parse(localStorage.getItem("lastId") || "[]")
      
      ObjectProduct.id = lastId + 1
      console.log("ObjectProduct ", ObjectProduct)
      await setCart((prevProducts) => [...prevProducts, ObjectProduct])
      await localStorage.setItem("lastId", JSON.stringify(lastId + 1))
    }
    setLoading(false)
  }

  const handleSelectPriceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setSortingPrice(value)
    if (value == "Descending"){
      products.sort((a, b) => a.price  - b.price )
    } else {
      products.sort((a, b) => b.price  - a.price )
    }
  }
  
  const handleCancleProduct = async (id: number) => {
    setLoading(true)
    setCart((prevCart) => prevCart.filter(cart => cart.id !== id))
    await localStorage.setItem("products", JSON.stringify(cart))
    setLoading(false)
  }

  useEffect(() => {
    fetchProducts()
    if (localStorage.length !== 0) {
      const storedItems = JSON.parse(localStorage.getItem("products") || "[]")
      setCart(storedItems)
      console.log('ตอนดึง', storedItems)
    }
    setStateStart(true)
  }, [])

  useEffect(() => {
    if (stateCategory) {
        const fetchData = async () => {
        const fetchData = await fetch(`http://localhost:8000/${stateCategory}`)
        if (!fetchData.ok) {
          throw new Error("response was error")
        }
        const data = await fetchData.json()
        setProducts(data)
      }
      fetchData()
    }
    setLoading(false)
  }, [stateCategory])

  useEffect(() => {
    console.log("Cart updated:", cart)
    console.log("stateStart:", stateStart)
    if (stateStart) {
      console.log("Doooo ทำด้านในนนนน")
      localStorage.setItem("products", JSON.stringify(cart))
    }
    console.log("ใน local ", JSON.parse(localStorage.getItem("products") || "[]"))
  }, [cart])

  if (loading) {
    return <h1>Loading...</h1>;
  }

  if (error) {
    return <h1>Error: {error}</h1>;
  }
  
  return (
    <div>
      <h1>ร้านดูดี</h1>
      <CategoryProducts categories={category} onSelectChange={handleSelectChange} />
      <label> ราคา: </label>
            <select value={sortingPrice} onChange={handleSelectPriceChange}>
              <option value="">-- กรุณาเลือก --</option>
              <option value="Descending">จากน้อยไปมาก</option>
              <option value="Ascending">จากมากไปน้อย</option>
            </select>
      <br />
      <br />
      <ListGroup products={products} onAddToCart={handleAddToCart} />
      <br />
      <br />
      <br />
      <br />
      <h3>ตะกร้าของฉัน</h3>
      <table>
        <thead>
            <tr>
              <th>สินค้าในตะกร้า</th>
                <th>ราคา (บาท)</th>
                <th>ซื้อสินค้า</th>
            </tr>
        </thead>
        <tbody>
            {cart.map(c => (
            <tr key={c.id}>
                <td>{c.title}</td>
                <td>{c.price}</td>
                <td><button onClick={(() => handleCancleProduct(c.id))}>ยกเลิกสินค้า</button></td>
            </tr>
            ))}
        </tbody>
      </table>
    </div>
  )
}

export default App
