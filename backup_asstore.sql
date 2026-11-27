--
-- PostgreSQL database dump
--

\restrict nKeL84Pf75haXuD553excxNosIX5mSo23GFAM4XovtJGuiQpECrfdVrRdcVOQ2Q

-- Dumped from database version 16.16 (Homebrew)
-- Dumped by pg_dump version 18.4 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: banners; Type: TABLE; Schema: public; Owner: vinisilva
--

CREATE TABLE public.banners (
    id integer NOT NULL,
    title text NOT NULL,
    subtitle text,
    image_url text,
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);
ALTER TABLE ONLY public.banners ALTER COLUMN id SET (pg_attver=27323320);
ALTER TABLE ONLY public.banners ALTER COLUMN title SET (pg_attver=27323320);
ALTER TABLE ONLY public.banners ALTER COLUMN subtitle SET (pg_attver=27323320);
ALTER TABLE ONLY public.banners ALTER COLUMN image_url SET (pg_attver=27323320);
ALTER TABLE ONLY public.banners ALTER COLUMN active SET (pg_attver=27323320);
ALTER TABLE ONLY public.banners ALTER COLUMN created_at SET (pg_attver=27323320);


ALTER TABLE public.banners OWNER TO vinisilva;

--
-- Name: banners_id_seq; Type: SEQUENCE; Schema: public; Owner: vinisilva
--

CREATE SEQUENCE public.banners_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.banners_id_seq OWNER TO vinisilva;

--
-- Name: banners_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vinisilva
--

ALTER SEQUENCE public.banners_id_seq OWNED BY public.banners.id;


--
-- Name: coupons; Type: TABLE; Schema: public; Owner: vinisilva
--

CREATE TABLE public.coupons (
    id integer NOT NULL,
    code text NOT NULL,
    type text,
    value numeric(10,2),
    active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT now()
);
ALTER TABLE ONLY public.coupons ALTER COLUMN id SET (pg_attver=27138600);
ALTER TABLE ONLY public.coupons ALTER COLUMN code SET (pg_attver=27138600);
ALTER TABLE ONLY public.coupons ALTER COLUMN type SET (pg_attver=27138600);
ALTER TABLE ONLY public.coupons ALTER COLUMN value SET (pg_attver=27138600);
ALTER TABLE ONLY public.coupons ALTER COLUMN active SET (pg_attver=27138600);
ALTER TABLE ONLY public.coupons ALTER COLUMN created_at SET (pg_attver=27138600);


ALTER TABLE public.coupons OWNER TO vinisilva;

--
-- Name: coupons_id_seq; Type: SEQUENCE; Schema: public; Owner: vinisilva
--

CREATE SEQUENCE public.coupons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.coupons_id_seq OWNER TO vinisilva;

--
-- Name: coupons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vinisilva
--

ALTER SEQUENCE public.coupons_id_seq OWNED BY public.coupons.id;


--
-- Name: newsletter; Type: TABLE; Schema: public; Owner: vinisilva
--

CREATE TABLE public.newsletter (
    id integer NOT NULL,
    email text NOT NULL,
    coupon text,
    created_at timestamp without time zone DEFAULT now()
);
ALTER TABLE ONLY public.newsletter ALTER COLUMN id SET (pg_attver=27177848);
ALTER TABLE ONLY public.newsletter ALTER COLUMN email SET (pg_attver=27177848);
ALTER TABLE ONLY public.newsletter ALTER COLUMN coupon SET (pg_attver=27177848);
ALTER TABLE ONLY public.newsletter ALTER COLUMN created_at SET (pg_attver=27177848);


ALTER TABLE public.newsletter OWNER TO vinisilva;

--
-- Name: newsletter_id_seq; Type: SEQUENCE; Schema: public; Owner: vinisilva
--

CREATE SEQUENCE public.newsletter_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.newsletter_id_seq OWNER TO vinisilva;

--
-- Name: newsletter_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vinisilva
--

ALTER SEQUENCE public.newsletter_id_seq OWNED BY public.newsletter.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: vinisilva
--

CREATE TABLE public.orders (
    id text NOT NULL,
    status text DEFAULT 'pending'::text,
    total numeric(10,2),
    frete numeric(10,2),
    payment_method text,
    customer jsonb,
    items jsonb,
    created_at timestamp without time zone DEFAULT now(),
    paid_at timestamp without time zone
);
ALTER TABLE ONLY public.orders ALTER COLUMN id SET (pg_attver=27114424);
ALTER TABLE ONLY public.orders ALTER COLUMN status SET (pg_attver=27114424);
ALTER TABLE ONLY public.orders ALTER COLUMN total SET (pg_attver=27114424);
ALTER TABLE ONLY public.orders ALTER COLUMN frete SET (pg_attver=27114424);
ALTER TABLE ONLY public.orders ALTER COLUMN payment_method SET (pg_attver=27114424);
ALTER TABLE ONLY public.orders ALTER COLUMN customer SET (pg_attver=27114424);
ALTER TABLE ONLY public.orders ALTER COLUMN items SET (pg_attver=27114424);
ALTER TABLE ONLY public.orders ALTER COLUMN created_at SET (pg_attver=27114424);
ALTER TABLE ONLY public.orders ALTER COLUMN paid_at SET (pg_attver=27114424);


ALTER TABLE public.orders OWNER TO vinisilva;

--
-- Name: products; Type: TABLE; Schema: public; Owner: vinisilva
--

CREATE TABLE public.products (
    id integer NOT NULL,
    name text NOT NULL,
    brand text,
    category text,
    price numeric(10,2),
    promo_price numeric(10,2),
    stock integer DEFAULT 0,
    sizes integer[],
    images text[],
    description text,
    is_new boolean DEFAULT false,
    is_last_units boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);
ALTER TABLE ONLY public.products ALTER COLUMN id SET (pg_attver=27093120);
ALTER TABLE ONLY public.products ALTER COLUMN name SET (pg_attver=27093120);
ALTER TABLE ONLY public.products ALTER COLUMN brand SET (pg_attver=27093120);
ALTER TABLE ONLY public.products ALTER COLUMN category SET (pg_attver=27093120);
ALTER TABLE ONLY public.products ALTER COLUMN price SET (pg_attver=27093120);
ALTER TABLE ONLY public.products ALTER COLUMN promo_price SET (pg_attver=27093120);
ALTER TABLE ONLY public.products ALTER COLUMN stock SET (pg_attver=27093120);
ALTER TABLE ONLY public.products ALTER COLUMN sizes SET (pg_attver=27093120);
ALTER TABLE ONLY public.products ALTER COLUMN images SET (pg_attver=27093120);
ALTER TABLE ONLY public.products ALTER COLUMN description SET (pg_attver=27093120);
ALTER TABLE ONLY public.products ALTER COLUMN is_new SET (pg_attver=27093120);
ALTER TABLE ONLY public.products ALTER COLUMN is_last_units SET (pg_attver=27093120);
ALTER TABLE ONLY public.products ALTER COLUMN created_at SET (pg_attver=27093120);


ALTER TABLE public.products OWNER TO vinisilva;

--
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: vinisilva
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO vinisilva;

--
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: vinisilva
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- Name: settings; Type: TABLE; Schema: public; Owner: vinisilva
--

CREATE TABLE public.settings (
    key text NOT NULL,
    value text
);
ALTER TABLE ONLY public.settings ALTER COLUMN key SET (pg_attver=27157904);
ALTER TABLE ONLY public.settings ALTER COLUMN value SET (pg_attver=27157904);


ALTER TABLE public.settings OWNER TO vinisilva;

--
-- Name: banners id; Type: DEFAULT; Schema: public; Owner: vinisilva
--

ALTER TABLE ONLY public.banners ALTER COLUMN id SET DEFAULT nextval('public.banners_id_seq'::regclass);


--
-- Name: coupons id; Type: DEFAULT; Schema: public; Owner: vinisilva
--

ALTER TABLE ONLY public.coupons ALTER COLUMN id SET DEFAULT nextval('public.coupons_id_seq'::regclass);


--
-- Name: newsletter id; Type: DEFAULT; Schema: public; Owner: vinisilva
--

ALTER TABLE ONLY public.newsletter ALTER COLUMN id SET DEFAULT nextval('public.newsletter_id_seq'::regclass);


--
-- Name: products id; Type: DEFAULT; Schema: public; Owner: vinisilva
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- Data for Name: banners; Type: TABLE DATA; Schema: public; Owner: vinisilva
--

COPY public.banners (id, title, subtitle, image_url, active, created_at) FROM stdin;
1	Os tênis mais desejados do Brasil	Autenticidade garantida, entrega expressa e 5% OFF no PIX.	https://images.unsplash.com/photo-1552346154-21d32810aba3	f	2026-11-18 13:57:08.051632
2	Os tênis mais desejados do Bra	Autenticidade garantida, entrega expressa e 5% OFF no PIX.	https://images.unsplash.com/photo-1552346154-21d32810aba3	f	2026-11-18 14:02:26.876289
3	Os tênis mais desejados do Brasil	Autenticidade garantida, entrega expressa e 5% OFF no PIX.	https://images.unsplash.com/photo-1552346154-21d32810aba3	f	2026-11-18 14:02:37.832782
4	Os tênis mais desejados do Brasil	Autenticidade garantida, entrega expressa e 5% OFF no PIX.	http://localhost:4000/uploads/1795025051706-257019956.jpeg	f	2026-11-18 14:04:12.708164
5	Os tênis mais desejados do Brasil	Autenticidade garantida, entrega expressa e 5% OFF no PIX.	http://localhost:4000/uploads/1795025051706-257019956.jpeg	f	2026-11-18 14:04:13.927771
6	Os tênis mais desejados do Brasil	Autenticidade garantida, entrega expressa e 5% OFF no PIX.	http://localhost:4000/uploads/1795025142308-774797654.jpeg	f	2026-11-18 14:05:43.240724
7	Os tênis mais desejados do Brasil	Autenticidade garantida, entrega expressa e 5% OFF no PIX.	http://localhost:4000/uploads/1795025164319-836702012.jpeg	f	2026-11-18 14:06:11.713209
8	Os tênis mais desejados do Brasil	Autenticidade garantida, entrega expressa e 5% OFF no PIX.	http://localhost:4000/uploads/1795025515316-332236204.jpeg	t	2026-11-18 14:12:03.20971
\.


--
-- Data for Name: coupons; Type: TABLE DATA; Schema: public; Owner: vinisilva
--

COPY public.coupons (id, code, type, value, active, created_at) FROM stdin;
\.


--
-- Data for Name: newsletter; Type: TABLE DATA; Schema: public; Owner: vinisilva
--

COPY public.newsletter (id, email, coupon, created_at) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: vinisilva
--

COPY public.orders (id, status, total, frete, payment_method, customer, items, created_at, paid_at) FROM stdin;
\.


--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: vinisilva
--

COPY public.products (id, name, brand, category, price, promo_price, stock, sizes, images, description, is_new, is_last_units, created_at) FROM stdin;
1	Tenis Nike Teste	AS Store	masculino	599.00	\N	5	{38,39,40,41,42}	{http://localhost:4000/uploads/1795023938824-317707722.png}	Tênis exclusivo AS Store.	t	f	2026-11-18 13:45:57.319938
2	Nike Air Max 270	Nike	masculino	899.90	749.90	25	{38,39,40,41,42,43}	{https://images.unsplash.com/photo-1542291026-7eec264c27ff}	O Nike Air Max 270 combina conforto e estilo com a maior unidade Air da história.	t	f	2026-11-18 13:56:04.12062
3	Adidas Ultraboost 22	Adidas	masculino	1099.90	\N	15	{38,39,40,41,42,43}	{https://images.unsplash.com/photo-1608231387042-66d1773070a5}	Retorno de energia incrível e conforto máximo para suas corridas.	f	f	2026-11-18 13:56:04.123707
4	New Balance 9060	New Balance	lancamentos	1299.90	1099.90	8	{36,37,38,39,40,41,42}	{https://images.unsplash.com/photo-1600185365483-26d7a4cc7519}	Design retrô com tecnologia moderna. O 9060 é o tênis do momento.	t	t	2026-11-18 13:56:04.124249
5	Puma Suede Classic	Puma	casual	499.90	399.90	30	{36,37,38,39,40,41,42,43}	{https://images.unsplash.com/photo-1600269452121-4f2416e55c28}	Um clássico atemporal. O Puma Suede é ícone do streetwear mundial.	f	f	2026-11-18 13:56:04.124736
6	Vans Old Skool	Vans	skate	399.90	349.90	20	{38,39,40,41,42,43}	{https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77}	O clássico do skate. Durável, confortável e cheio de estilo.	f	f	2026-11-18 13:56:04.125349
7	Nike Jordan 1 Mid	Nike	lancamentos	1499.90	\N	5	{38,39,40,41,42,43,44}	{https://images.unsplash.com/photo-1552346154-21d32810aba3}	O lendário Air Jordan 1 Mid. Um dos tênis mais desejados do mundo.	t	t	2026-11-18 13:56:04.125752
8	Adidas NMD R1	Adidas	feminino	799.90	649.90	18	{34,35,36,37,38,39}	{https://images.unsplash.com/photo-1587563871167-1ee9c731aefb}	Estilo futurista com amortecimento Boost. Perfeito para o dia a dia.	f	f	2026-11-18 13:56:04.126139
9	Nike Air Force 1	Nike	feminino	899.90	\N	12	{34,35,36,37,38,39,40}	{https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a}	O clássico que nunca sai de moda. Air Force 1 é sinônimo de estilo.	f	f	2026-11-18 13:56:04.126511
10	Puma RS-X	Puma	promocoes	699.90	499.90	10	{38,39,40,41,42}	{https://images.unsplash.com/photo-1608379743498-51d0c72e56c4}	Design chunky e cores vibrantes. O RS-X é pura atitude.	f	t	2026-11-18 13:56:04.12697
11	New Balance 550	New Balance	promocoes	999.90	799.90	7	{36,37,38,39,40,41,42}	{https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa}	Estilo basquete dos anos 80 com toque moderno. O 550 é tendência.	f	t	2026-11-18 13:56:04.127816
12	Vans Sk8-Hi	Vans	skate	449.90	\N	22	{38,39,40,41,42,43,44}	{https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a}	Cano alto, suporte de tornozelo e estilo clássico do skate.	f	f	2026-11-18 13:56:04.128327
13	Nike Dunk Low	Nike	lancamentos	1099.90	899.90	9	{38,39,40,41,42,43}	{https://images.unsplash.com/photo-1600269452121-4f2416e55c28}	O Dunk voltou com tudo. Design icônico e conforto incomparável.	t	f	2026-11-18 13:56:04.128692
\.


--
-- Data for Name: settings; Type: TABLE DATA; Schema: public; Owner: vinisilva
--

COPY public.settings (key, value) FROM stdin;
\.


--
-- Name: banners_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vinisilva
--

SELECT pg_catalog.setval('public.banners_id_seq', 8, true);


--
-- Name: coupons_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vinisilva
--

SELECT pg_catalog.setval('public.coupons_id_seq', 1, false);


--
-- Name: newsletter_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vinisilva
--

SELECT pg_catalog.setval('public.newsletter_id_seq', 1, false);


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: vinisilva
--

SELECT pg_catalog.setval('public.products_id_seq', 13, true);


--
-- Name: banners banners_pkey; Type: CONSTRAINT; Schema: public; Owner: vinisilva
--

ALTER TABLE ONLY public.banners
    ADD CONSTRAINT banners_pkey PRIMARY KEY (id);


--
-- Name: coupons coupons_code_key; Type: CONSTRAINT; Schema: public; Owner: vinisilva
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_code_key UNIQUE (code);


--
-- Name: coupons coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: vinisilva
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_pkey PRIMARY KEY (id);


--
-- Name: newsletter newsletter_email_key; Type: CONSTRAINT; Schema: public; Owner: vinisilva
--

ALTER TABLE ONLY public.newsletter
    ADD CONSTRAINT newsletter_email_key UNIQUE (email);


--
-- Name: newsletter newsletter_pkey; Type: CONSTRAINT; Schema: public; Owner: vinisilva
--

ALTER TABLE ONLY public.newsletter
    ADD CONSTRAINT newsletter_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: vinisilva
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: vinisilva
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- Name: settings settings_pkey; Type: CONSTRAINT; Schema: public; Owner: vinisilva
--

ALTER TABLE ONLY public.settings
    ADD CONSTRAINT settings_pkey PRIMARY KEY (key);


--
-- PostgreSQL database dump complete
--

\unrestrict nKeL84Pf75haXuD553excxNosIX5mSo23GFAM4XovtJGuiQpECrfdVrRdcVOQ2Q

