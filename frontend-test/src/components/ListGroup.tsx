import { useState } from 'react';
import './ListGroup.css'

interface Product {
    id: number;
    title: string;
    price: number;
}

interface ListGroupProps {
    products: Product[]
    onAddToCart: (value: Product) => void
}

const ListGroup: React.FC<ListGroupProps> = ({ products, onAddToCart }) => {    
    return <>
        <table>
            <thead>
                <tr>
                    <th>ชื่อสินค้า</th>
                    <th>ราคา (บาท)</th>
                    <th>ซื้อสินค้า</th>
                </tr>
            </thead>
            <tbody>
                {products.map(product => (
                <tr key={product.id}>
                    <td>{product.title}</td>
                    <td>{product.price}</td>
                    <td><button onClick={() => onAddToCart(product)}>เพิ่มไปยังรถเข็น</button></td>
                </tr>
                ))}
            </tbody>
        </table>
    </>
}

export default ListGroup