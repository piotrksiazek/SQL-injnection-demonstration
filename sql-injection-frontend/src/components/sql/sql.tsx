import { useEffect, useState } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { docco } from 'react-syntax-highlighter/dist/esm/styles/hljs';

export interface loginAndPassword{
    login: string;
    password: string;
    processing: string
}

export const Sql = (props: loginAndPassword) => {

  const getWithQuotes = (input: string): string => {
    if((input.split("'").length - 1) % 2 === 1){
      return input + "'";
    }
    return input;
  };

  const getSqlString = (typeOfProcessing: string): string => {
    if(typeOfProcessing === "Raw"){
      return `SELECT * FROM USERS WHERE login='${props.login}' AND password='${props.password}'`;
    }
    else if(typeOfProcessing === "Interpolated"){
      return `.param set p0 '${getWithQuotes(props.login)}'\n.param set p1 '${getWithQuotes(props.password)}'\nSELECT * FROM Users WHERE Username=@p0 AND Password=@p1`
    }
    else if(typeOfProcessing === "Orm"){
      return `.param set @__username_0 '${getWithQuotes(props.login)}'
.param set @__password_1 '${getWithQuotes(props.password)}'
      
SELECT "u"."Id", "u"."Password", "u"."Username"
FROM "Users" AS "u"
WHERE ("u"."Username" = @__username_0) AND ("u"."Password" = @__password_1)`;
    }
    return "";
    // else if(typeOfProcessing == TypeOfSqlProcessing.Orm)
  }

  const [sqlString, setSqlString] = useState(getSqlString("Raw"));
  

  useEffect(() => {
    setSqlString(getSqlString(props.processing))
  }, [props])

  return (
    <SyntaxHighlighter language="sql" style={docco}>
      {sqlString}
    </SyntaxHighlighter>
  );
};