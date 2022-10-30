INSERT INTO public.roles (id, name) VALUES (1, 'user');
INSERT INTO public.roles (id, name) VALUES (2, 'admin');

INSERT INTO public.users (id, login, name, password, role_id, avatar, email) VALUES (1, 'admin', 'Admin', '$2b$10$NVlcjR9QFsGseGzyLILvpuoq5TkjPoBjBXD/8ZlynPQfpqvZVdIuC', 2, null, 'admin@mail.com');

INSERT INTO public.categories (id, title, description) VALUES (1, 'javascript', 'Programming language');
