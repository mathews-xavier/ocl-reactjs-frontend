import React from "react";
import customData from "../config/configuration.json";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import { useState , useEffect} from 'react';
import {useRef} from 'react';
import DataService from "../services/data.service";



const Profile = () => {
 
  const inputRef = useRef(null);
  const [header, setHeader] = useState('');
  const [didLoad, setDidLoad] = useState(false);
  const [total, setTotal] = useState(0);
  const [newData, setNewData] = useState([]);
  const [impact, setImpact] = useState('');
  const [resources, setResources] = useState(customData.resources);
  const [calculationRules, setCalculationRules] = useState(customData.calculationRules);

  const getItemIndex = (arr, item) => {
    return arr.findIndex((e) => e.dataId === item);
  };

  useEffect(async () => {
    if (!didLoad) {
    const data = await DataService.getUserData();
    await setNewData(data);
    }
    setDidLoad(true);
  });


  const calculateTotal =  (event,index) => {
    event.preventDefault();
    let total = 0;
    newData.map((item,index) => {
      total = Number(total) + Number(item.co2e);
    });
    setTotal(total.toFixed(5));
    DataService.saveData(newData);
  }

  const calculate =  (event,index) => {
    if(event != null){event.preventDefault();}
    let tempIndex = index;
    const newItems = newData.map((item,index) => {
      let rsrcId = item.resourceId;
      let indId = item.dataId;
      if (tempIndex == index) {
        const tempObj = item;
         calculationRules.map((item,index) => {
          let finalVal = 1;
          if (item.calculationRuleId == impact) {
            item.multiplyFormula.map((val)=>{
              if(val != "quantity"){
                resources.map((rsrce) =>{
                  const itemIndex = getItemIndex(newData,indId );
                    if(rsrcId == rsrce.resourceId){
                      rsrce.impacts.map((matt) => {
                        const entries = Object.entries(matt);
                        entries.map(([key, value]) => {
                          if(val == key){
                            finalVal = finalVal*value;
                            let obj = [];
                            if(event != null){
                               obj = {dataId: tempObj.dataId, resourcename: tempObj.resourcename, resourceId: tempObj.resourceId , quantity:event.target.value, co2e: (event.target.value*finalVal).toFixed(5)}; 
                            }else{
                               obj = {dataId: tempObj.dataId, resourcename: tempObj.resourcename, resourceId: tempObj.resourceId , quantity:tempObj.quantity, co2e: (tempObj.quantity*finalVal).toFixed(5)}; 
                            }
                            const newArr = [...newData];
                            newArr[itemIndex] = obj;
                            setNewData(newArr);
                          }
                        });
                        
                      });
                    }
                });
            
              }
               
            });
           
          }
        });
      }
    });
    
  };

  const handleChange = (event) => {
    event.preventDefault();
    if(event.target.value == "impactGwp"){
      setHeader("CO2e");
    }else{
      setHeader("SO2e");
    }
    setImpact(event.target.value);
    newData.map((item,index) => {
      calculate(null,index);
    });
    setTotal(0);
  }

  const addRows = (event) => {
     event.preventDefault();
     if(header != "CO2e" && header != "SO2e"){
      alert("Please select one of the Impact first (CO2e/SO2e)");
      return
     }
    console.log(inputRef.current.value);
     if(inputRef.current.value == "#"){
          return;
        }
        

    const rsrcName = resources.map((rsrc,index) => {
        if(inputRef.current.value == rsrc.resourceId){
          return rsrc.name;
        }
    }).filter(function( element ) {
      return element !== undefined;
   });

    console.log(rsrcName);

    const val = {
      dataId: newData.length,
      resourceId: inputRef.current.value,
      resourcename: rsrcName[0],
      quantity: 0,
      co2e: 0
    };
    const updatedNewData = [...newData];
    updatedNewData.push(val);
    setNewData(updatedNewData);
  };
  
  const tableRows =  newData.map((info,index) => {
    return (
      <tr>
        <td>{info.resourcename}</td>
        <td><input type="text" id={index} defaultValue={info.quantity} onChange={event => calculate(event, index)}/></td>
        <td>{info.co2e}kg</td>
      </tr>
    );
  });

  const radios = calculationRules.map((impact,index) => {
    return (
      <label>
      <input
        type="radio"
        value={impact.calculationRuleId}
        name="impact"
        onChange={handleChange}
      />
      {" "}{impact.name} 
      </label> 
    );
  });

  const selects = resources.map((resrc,index) => {
    return (
    <>
        <option value={resrc.resourceId} name={resrc.name}>{resrc.name}</option>
        </>
    );
  });
  
  const handleClick = (e) => {
    e.preventDefault();
    console.log('The link was clicked.');
  }

  return (
    <Container>
    <Row>
      <Col>
      <div class="input-group mb-3">
    <select class="form-control" id="exampleFormControlSelect1" ref={inputRef}>
      
    <option id="#" value="#">Select the Resource</option>
    {selects}
    </select>
    <div class="input-group-append">
    <button class="btn btn-primary" onClick={addRows} type="button">Add</button>
  </div>
  </div>
      </Col>
      <Col>
      <div class="input-group mb-3">
      {radios}
        </div>
      </Col>
      <Col>
      <button class="btn btn-success" onClick={calculateTotal} type="button">Calculate</button>
      </Col>
    </Row>
    <Row>
      <Col>
      <Table striped bordered hover>
      <thead>
        <tr>
          
          <th>Resource</th>
          <th>Quantity</th>
          <th>{header}</th>
        </tr>
      </thead>
      <tbody>{tableRows}</tbody>
    </Table>
      </Col>
      </Row>
      <Row>
        <Col>
        <p class="text-xl-right" style={{fontSize:50, color:"green"}}>Total:{" "}{total}</p>
        </Col>
      </Row>
  </Container>
  );
};

export default Profile;
