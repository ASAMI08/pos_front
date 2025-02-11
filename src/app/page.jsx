'use client';
import { useState } from 'react';
import axios from 'axios';

const PurchasePage = () => {
  const [productCode, setProductCode] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productList, setProductList] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);

  // 商品コード読み込みボタンが押されたときの処理
  const handleScanProductCode = async () => {
    try {
      const requestUrl = `http://localhost:8000/search_product`;

      const response = await axios.post(requestUrl, {
        code: productCode.trim(),  // 商品コードをリクエストボディに含める
      });

      if (response.data && response.data.name) {
        setProductName(response.data.name);  // 商品名をセット
        setProductPrice(response.data.price); // 価格をセット
      } else {
        alert("商品が見つかりません");
        setProductName('');
        setProductPrice('');
      }
    } catch (error) {
      alert("商品が見つかりません");
      setProductName('');
      setProductPrice('');
    }
  };

  // 購入リストに商品を追加する処理
  const handleAddToList = () => {
    if (productName && productPrice) {
      setProductList([...productList, { 
        product_code: productCode,  // 'product_code' を追加
        name: productName, 
        price: productPrice, 
        quantity: 1 
      }]);
      setProductCode('');
      setProductName('');
      setProductPrice('');
    }
  };

  // 購入処理
  const handlePurchase = async () => {
    try {
      const requestUrl = `http://localhost:8000/purchase`;
      const response = await axios.post(requestUrl, {
        emp_cd: 'emp123',  // 従業員コード
        store_cd: 'store1',  // 店舗コード
        pos_no: 'pos001',  // POS番号
        items: productList.map(product => ({
          product_code: product.product_code,  // 'product_code' を追加
          quantity: product.quantity || 1  // 数量を適切に設定
        }))
      });
  
      if (response.data.total_amount) {
        setTotalAmount(response.data.total_amount);
        setShowPopup(true);  // ポップアップを表示
      }
    } catch (error) {
      console.error("購入処理エラー:", error);
      alert("購入処理に失敗しました");
    }
  };

  // ポップアップを閉じてリセット
  const handleClosePopup = () => {
    setShowPopup(false);
    setProductList([]);
    setTotalAmount(0);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px' }}>
      {/* 商品コード入力エリア */}
      <div style={{ width: '40%' }}>
        <input 
          type="text" 
          placeholder="商品コード" 
          value={productCode} 
          onChange={(e) => setProductCode(e.target.value)} 
          style={{ width: '100%', padding: '10px', marginBottom: '10px' }} 
        />
        <button 
          onClick={handleScanProductCode} 
          style={{ width: '100%', padding: '10px', backgroundColor: '#90caf9', border: 'none', color: '#fff' }}>
          商品コード 読み込み
        </button>

        {/* 商品名と価格の表示 */}
        <div style={{ marginTop: '10px' }}>
          <p><strong>{productName}</strong></p>
          <p>{productPrice}</p>
        </div>

        {/* 追加ボタン */}
        <button 
          onClick={handleAddToList} 
          style={{ width: '100%', padding: '10px', backgroundColor: '#90caf9', border: 'none', color: '#fff' }}>
          追加
        </button>
      </div>

      {/* 購入リスト */}
      <div style={{ width: '50%' }}>
        <h3>購入リスト</h3>
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          {productList.map((product, index) => (
            <li key={index} style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>
              {product.name} x 1 {product.price}
            </li>
          ))}
        </ul>
        <button 
          onClick={handlePurchase} 
          style={{ width: '100%', padding: '10px', backgroundColor: '#90caf9', border: 'none', color: '#fff' }}>
          購入
        </button>
      </div>

      {/* ポップアップで合計金額を表示 */}
      {showPopup && (
        <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#fff', padding: '20px', border: '1px solid #ccc' }}>
          <h3>購入合計金額</h3>
          <p>{totalAmount}円（税込）</p>
          <button onClick={handleClosePopup} style={{ padding: '10px', backgroundColor: '#90caf9', border: 'none', color: '#fff' }}>OK</button>
        </div>
      )}
    </div>
  );
};

export default PurchasePage;
