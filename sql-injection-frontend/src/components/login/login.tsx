import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import React, { useState } from 'react';
import { User } from '../../entities/user';
import { Sql } from '../sql/sql';

export const Login = () => {
    const baseUrl = "https://localhost:7050/SqlInjection/"
    const unsafeEndpoint = baseUrl + "unsafe";
    const interpolatedEndpoint = baseUrl + "interpolated"
    const ormEndpoint = baseUrl + "orm"
    const [login, setLogin] = useState("");
    const [password, setPassword] = useState("");
    const [users, setUsers] = useState<User[]>([]);
    const [url, setUrl] = useState(unsafeEndpoint);
    const [typeOfProcessing, setTypeOfProcessing] = useState("Raw");

    const handleLogin = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setLogin(event.target.value);
    }

    const handlePassword = (event: { target: { value: React.SetStateAction<string>; }; }) => {
        setPassword(event.target.value);
    }

    const handleTypeOfProcessing = (event: SelectChangeEvent) => {
        let value = event.target.value as string;
        setTypeOfProcessing(value);
        if(value === "Raw"){
            setUrl(unsafeEndpoint);
        }
        else if(value === "Interpolated"){
            setUrl(interpolatedEndpoint);
        }
        else{
            setUrl(ormEndpoint);
        }
      };

    const getUnsafeResult = () => {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        headers.append('Accept', 'application/json');
        headers.append('Origin','http://localhost:3000');
        fetch(`${url}/${login}/${password}`,
        {headers: headers})
        .then(response => response.json())
        .then(data => {
            setUsers(data);
            console.log(data)
        })
    }

    const clearResult = (setData: any) => {
        setData([]);
    }

    return (
        <div>
            <h1>Logowanie</h1>
            <input type="text" value={login} onChange={handleLogin}/>
            <input type="text" value={password} onChange={handlePassword}/>
            <div style={{textAlign:"left", width:"30%", margin:"auto"}}>
                <Sql login={login} password={password} processing={typeOfProcessing}></Sql>
            </div>
            
            <div style={{ display: 'flex',  alignItems: "center", justifyContent: "center"  }}>
                <Button variant="outlined" onClick={getUnsafeResult}>Get</Button>
                <Button variant="outlined" onClick={() => clearResult(setUsers)}>Clear</Button>
                <Box sx={{ minWidth: 120 }}>
                <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Processing</InputLabel>
                    <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={typeOfProcessing}
                    label="Age"
                    onChange={handleTypeOfProcessing}
                    >
                    <MenuItem value={"Raw"}>{"Raw"}</MenuItem>
                    <MenuItem value={"Interpolated"}>{"Interpolated"}</MenuItem>
                    <MenuItem value={"Orm"}>{"Orm"}</MenuItem>
                    </Select>
                </FormControl>
                </Box>
            </div>

            {users.length > 0 &&
            <div style={{paddingLeft: '20%', paddingRight: '20%'  }}>
                <TableContainer component={Paper}>
                <Table sx={{ minWidth: 300 }} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Id</TableCell>
                        <TableCell align="right">Username</TableCell>
                        <TableCell align="right">Password</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {users.map((row, index) => (
                        <TableRow
                        key={index}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                        <TableCell component="th" scope="row">
                            {index}
                        </TableCell>
                        <TableCell align="right">{row.username}</TableCell>
                        <TableCell align="right">{row.password}</TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </TableContainer>
            </div>
            }
            
        </div>
      );
}