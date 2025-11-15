# =€ 094 ?> 45?;>N =0 Render + Netlify

-B>B 3094 ?><>65B 20< @0725@=CBL 8=D>@<0F8>==CN A8AB5<C 8718@0B5;L=>9 :><8AA88 =0 15A?;0B=KE E>AB8=30E:
- **Render** - 4;O backend (FastAPI + SQLite)
- **Netlify** - 4;O frontend (React)

---

## =Ë @5420@8B5;L=K5 B@51>20=8O

1. **::0C=B =0 GitHub** (@5?>78B>@89 C65 4>;65= 1KBL 70;8B)
2. **::0C=B =0 Render** - A>7409B5 =0 [render.com](https://render.com)
3. **::0C=B =0 Netlify** - A>7409B5 =0 [netlify.com](https://netlify.com)

---

## <¯ '0ABL 1: 5?;>9 Backend =0 Render

### (03 1: >43>B>2:0 @5?>78B>@8O

#1548B5AL, GB> 2A5 D09;K 70:><<8G5=K 8 70?CH5=K 2 GitHub:
```bash
git add .
git commit -m "Add deployment configs"
git push
```

### (03 2: !>740=85 Web Service =0 Render

1. 0948B5 =0 [dashboard.render.com](https://dashboard.render.com)
2. 06<8B5 **"New +"** ’ **"Web Service"**
3. >4:;NG8B5 20H GitHub @5?>78B>@89 `election_commission`
4. 0AB@>9B5 ?0@0<5B@K:

   **Basic Settings:**
   - **Name**: `election-commission-api` (8;8 ;N1>5 4@C3>5 8<O)
   - **Region**: `Frankfurt (EU Central)` (8;8 1;8609H89 : 20<)
   - **Branch**: `main` (8;8 20H0 @01>G0O 25B:0)
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`

   **Build & Deploy:**
   - **Build Command**:
     ```bash
     pip install -r requirements.txt
     ```
   - **Start Command**:
     ```bash
     chmod +x start.sh && ./start.sh
     ```

### (03 3: 0AB@>9:0 Environment Variables

 @0745;5 **Environment Variables** 4>102LB5:

| Key | Value |
|-----|-------|
| `SECRET_KEY` | 06<8B5 **Generate** (A35=5@8@C5B 02B><0B8G5A:8) |
| `ALGORITHM` | `HS256` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `10080` |
| `DATABASE_URL` | `sqlite:///./database/election_commission.db` |
| `PYTHON_VERSION` | `3.11.0` |

### (03 4: 5?;>9

1. 06<8B5 **"Create Web Service"**
2. Render =0G=5B A1>@:C 8 45?;>9 (709<5B 3-5 <8=CB)
3. >A;5 CA?5H=>3> 45?;>O 2K ?>;CG8B5 URL B8?0:
   ```
   https://election-commission-api.onrender.com
   ```

### (03 5: @>25@:0 Backend

B:@>9B5 2 1@0C75@5:
```
https://your-app-name.onrender.com/docs
```

K 4>;6=K C2845BL Swagger 4>:C<5=B0F8N API.

**  : !>E@0=8B5 MB>B URL - >= ?>=04>18BAO 4;O =0AB@>9:8 frontend!**

---

## <¨ '0ABL 2: 5?;>9 Frontend =0 Netlify

### (03 1: 1=>2;5=85 API URL

1. B:@>9B5 D09; `frontend/.env.production`
2. 0<5=8B5 URL =0 20H @50;L=K9 Render URL:
   ```env
   VITE_API_URL=https://your-render-app-name.onrender.com/api/v1
   ```
3. 0:><<8BLB5 87<5=5=8O:
   ```bash
   git add frontend/.env.production
   git commit -m "Update production API URL"
   git push
   ```

### (03 2: !>740=85 A09B0 =0 Netlify

#### 0@80=B : '5@57 Netlify Dashboard (@5:><5=4C5BAO)

1. 0948B5 =0 [app.netlify.com](https://app.netlify.com)
2. 06<8B5 **"Add new site"** ’ **"Import an existing project"**
3. K15@8B5 **"Deploy with GitHub"**
4. 2B>@87C9B5 Netlify 2 GitHub
5. K15@8B5 @5?>78B>@89 `election_commission`
6. 0AB@>9B5 ?0@0<5B@K:

   **Site settings:**
   - **Branch to deploy**: `main` (8;8 20H0 25B:0)
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/dist`

   **Environment variables:**
   - >102LB5 ?5@5<5==CN `VITE_API_URL` A> 7=0G5=85< 20H53> Render URL:
     ```
     https://your-render-app-name.onrender.com/api/v1
     ```

7. 06<8B5 **"Deploy site"**

#### 0@80=B : '5@57 Netlify CLI

```bash
# #AB0=>28B5 Netlify CLI
npm install -g netlify-cli

# 0;>38=LB5AL
netlify login

# 5@5948B5 2 ?0?:C frontend
cd frontend

# =8F80;878@C9B5 ?@>5:B
netlify init

# !;54C9B5 8=AB@C:F8O< 2 B5@<8=0;5
```

### (03 3: 0AB@>9:0 Environment Variables

A;8 2K =5 4>1028;8 ?@8 A>740=88:

1. 5@5948B5 2 **Site settings** ’ **Environment variables**
2. >102LB5:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-render-app-name.onrender.com/api/v1`
3. 06<8B5 **"Save"**
4. 5@5948B5 2 **Deploys** ’ **"Trigger deploy"** ’ **"Deploy site"**

### (03 4: >;CG5=85 URL

>A;5 CA?5H=>3> 45?;>O 2K ?>;CG8B5 URL B8?0:
```
https://random-name-123.netlify.app
```

K <>65B5 87<5=8BL 53> =0 :0AB><=K9 2 =0AB@>9:0E:
**Site settings** ’ **Domain management** ’ **"Change site name"**

### (03 5: @>25@:0 Frontend

B:@>9B5 20H Netlify URL 2 1@0C75@5. K 4>;6=K C2845BL 3;02=CN AB@0=8FC A8AB5<K.

---

## =' 1=>2;5=85 CORS =0 Backend (!)

>A;5 ?>;CG5=8O Netlify URL, >1=>28B5 CORS =0AB@>9:8:

1. B:@>9B5 `backend/app/core/config.py`
2. >102LB5 20H Netlify URL 2 `BACKEND_CORS_ORIGINS`:
   ```python
   BACKEND_CORS_ORIGINS: list = [
       "http://localhost:3000",
       "http://localhost:5173",
       "https://your-site.netlify.app",  # >102LB5 20H URL
       "https://*.netlify.app",
       "https://*.onrender.com"
   ]
   ```
3. 0:><<8BLB5 8 70?CHLB5 87<5=5=8O
4. Render 02B><0B8G5A:8 ?5@570?CAB8B ?@8;>65=85

---

##  @>25@:0 @01>B>A?>A>1=>AB8

### 1. @>25@LB5 Backend
```bash
curl https://your-render-app.onrender.com/
```

B25B 4>;65= 1KBL ?@8<5@=> B0:8<:
```json
{
  "message": "718@0B5;L=0O :><8AA8O @O=A:>9 >1;0AB8 API",
  "version": "1.0.0",
  "docs": "/docs"
}
```

### 2. @>25@LB5 Frontend

B:@>9B5 20H Netlify A09B 8 ?>?@>1C9B5:
1. >9B8 :0: 04<8= (login: `admin`, password: `admin123`)
2. 0@538AB@8@>20BL =>2>3> 8718@0B5;O
3. !>740BL 2K1>@K (2 04<8=-?0=5;8)

---

## = 2B><0B8G5A:89 45?;>9

10 A5@28A0 =0AB@>5=K =0 02B><0B8G5A:89 45?;>9:

- **Render**: @8 :064>< push 2 @5?>78B>@89, backend 02B><0B8G5A:8 ?5@5A>18@05BAO
- **Netlify**: @8 :064>< push 2 @5?>78B>@89, frontend 02B><0B8G5A:8 ?5@5A>18@05BAO

---

## =Ê >=8B>@8=3

### Render Dashboard
- @>A<>B@ ;>3>2: **Logs** tab
- 5B@8:8: **Metrics** tab
- !B0BCA: **Events** tab

### Netlify Dashboard
- @>A<>B@ 45?;>52: **Deploys** tab
- >38 A1>@:8: ;8:=8B5 =0 :>=:@5B=K9 45?;>9
- Analytics: **Analytics** tab (?;0B=>)

---

##   06=K5 70<5G0=8O

### @> 15A?;0B=K9 ?;0= Render:

1. **!?OI89 @568<**: >A;5 15 <8=CB =50:B82=>AB8 A5@28A "70AK?05B". 5@2K9 70?@>A ?>A;5 A=0 709<5B ~30-60 A5:C=4 (E>;>4=K9 AB0@B).

2. **3@0=8G5=8O**:
   - 750 G0A>2 2 <5AOF
   - 2B><0B8G5A:0O >AB0=>2:0 ?>A;5 ?@52KH5=8O ;8<8B0

3. ** 5H5=85 ?@>1;5<K A=0**:
   - A?>;L7C9B5 cron-job A5@28A (=0?@8<5@, [cron-job.org](https://cron-job.org)) 4;O ?8=30 20H53> API :064K5 10 <8=CB:
     ```
     https://your-render-app.onrender.com/
     ```

### @> SQLite =0 Render:

  ****: SQLite 1070 40==KE =0 Render  ?5@A8AB5=B=0! @8 :064>< @545?;>5 40==K5 B5@ONBAO.

** 5H5=8O**:

1. **;O ?@>40:H5=0**: A?>;L7C9B5 2=5H=NN :
   - PostgreSQL =0 [Supabase](https://supabase.com) (15A?;0B=>)
   - PostgreSQL =0 [ElephantSQL](https://www.elephantsql.com) (15A?;0B=>)
   - MongoDB =0 [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (15A?;0B=>)

2. **;O B5AB8@>20=8O**: "5:CI0O SQLite :>=D83C@0F8O ?>4>945B, => ?><=8B5 GB> 40==K5 1C4CB A1@0AK20BLAO.

### @> 15A?;0B=K9 ?;0= Netlify:

- **100 GB bandwidth** 2 <5AOF
- **300 <8=CB build time** 2 <5AOF
- -B>3> 1>;55 G5< 4>AB0B>G=> 4;O CG51=>3> ?@>5:B0

---

## = Troubleshooting ( 5H5=85 ?@>1;5<)

### @>1;5<0: Backend =5 70?CA:05BAO =0 Render

** 5H5=85:**
1. @>25@LB5 ;>38 2 Render Dashboard ’ **Logs**
2. #1548B5AL, GB> `start.sh` 8<55B ?@020 =0 2K?>;=5=85
3. @>25@LB5, GB> 2A5 environment variables CAB0=>2;5=K

### @>1;5<0: Frontend =5 <>65B ?>4:;NG8BLAO : Backend

** 5H5=85:**
1. #1548B5AL, GB> `VITE_API_URL` ?@028;L=> =0AB@>5=
2. @>25@LB5 CORS =0AB@>9:8 =0 backend
3. B:@>9B5 DevTools (F12) ’ Console 4;O ?@>A<>B@0 >H81>:

### @>1;5<0: "Cold start" 70=8<05B A;8H:>< 4>;3>

** 5H5=85:**
1. -B> =>@<0;L=> 4;O 15A?;0B=>3> ?;0=0 Render
2. 0AB@>9B5 cron-job 4;O @53C;O@=>3> ?8=30
3. ;8 >1=>28B5AL 4> ?;0B=>3> ?;0=0 ($7/<5AOF)

### @>1;5<0: 403 Forbidden ?@8 push 2 git

** 5H5=85:**
```bash
# #1548B5AL, GB> 8A?>;L7C5B5 ?@028;L=CN 25B:C
git checkout claude/election-commission-system-011CUpnoosCbniW1zz3nJZUr
git push -u origin claude/election-commission-system-011CUpnoosCbniW1zz3nJZUr
```

---

## <‰ >B>2>!

0H0 8=D>@<0F8>==0O A8AB5<0 @0725@=CB0 8 4>ABC?=0 >=;09=!

**!AK;:8:**
- < Frontend: `https://your-site.netlify.app`
- =' Backend API: `https://your-app.onrender.com`
- =Ú API Docs: `https://your-app.onrender.com/docs`

**#G5B=K5 40==K5 ?> C<>;G0=8N:**
- Login: `admin`
- Password: `admin123`

---

## =Þ >?>;=8B5;L=0O ?><>IL

- **Render Docs**: https://render.com/docs
- **Netlify Docs**: https://docs.netlify.com
- **FastAPI Deployment**: https://fastapi.tiangolo.com/deployment/
- **Vite Deployment**: https://vitejs.dev/guide/static-deploy.html

---

## =¡ !>25BK 4;O ?@>40:H5=0

A;8 2K ?;0=8@C5B5 8A?>;L7>20BL A8AB5<C 2 @50;L=KE CA;>28OE:

1. **!<5=8B5 ?0@>;L 04<8=8AB@0B>@0** 2 environment variables Render
2. **A?>;L7C9B5 PostgreSQL** 2<5AB> SQLite
3. **0AB@>9B5 SSL/TLS** (02B><0B8G5A:8 =0 Render 8 Netlify)
4. **>102LB5 rate limiting** 4;O 70I8BK >B DDoS
5. **0AB@>9B5 <>=8B>@8=3** (Sentry, LogRocket)
6. **C?8B5 ?;0B=K9 ?;0=** 4;O 871560=8O E>;>4=KE AB0@B>2
7. **0AB@>9B5 backup** 107K 40==KE
8. **>102LB5 :0AB><=K9 4><5=** (<>6=> :C?8BL =0 namecheap.com)

#40G8 A 45?;>5<! =€
