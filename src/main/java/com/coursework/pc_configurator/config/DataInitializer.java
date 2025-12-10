package com.coursework.pc_configurator.config;

import com.coursework.pc_configurator.model.Category;
import com.coursework.pc_configurator.model.Product;
import com.coursework.pc_configurator.repository.CategoryRepository;
import com.coursework.pc_configurator.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import com.coursework.pc_configurator.model.Role;
import com.coursework.pc_configurator.model.User;
import com.coursework.pc_configurator.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    @Override
    @Transactional
    public void run(String... args) throws Exception {

        // 0. СТВОРЕННЯ АДМІНА
        String adminEmail = "admin@technospace.com";
        if (userRepository.findByEmail(adminEmail).isEmpty()) {
            User admin = User.builder()
                    .firstname("Admin")
                    .lastname("System")
                    .email(adminEmail)
                    .password(passwordEncoder.encode("admintestAbc111"))
                    .role(Role.ADMIN)
                    .isBanned(false)
                    .build();
            userRepository.save(admin);
            System.out.println("--- АДМІН СТВОРЕНИЙ: " + adminEmail + " / admintestAbc111 ---");
        }

        if (categoryRepository.count() == 0) {
            // 1. Створюємо Категорії
            Map<String, Category> categories = new HashMap<>();
            String[] catNames = {
                    "Процесори", "Материнські плати", "Відеокарти", "ОЗУ",
                    "SSD накопичувачі", "Блоки живлення", "Корпуси",
                    "Монітори", "Клавіатури", "Мишки",
                    "Послуги"
            };

            for (String name : catNames) {
                Category c = new Category();
                c.setName(name);
                categories.put(name, categoryRepository.save(c));
            }

            // 2. Товари

            // --- ПРОЦЕСОРИ ---
            createProduct("Intel Core i3-12100F", 4100.0, categories.get("Процесори"),
                    "https://content.rozetka.com.ua/goods/images/big/556095570.jpg",
                    "Бюджетний ігровий процесор.",
                    "{\"socket\": \"LGA1700\", \"cores\": 4, \"frequency\": \"3.3GHz\", \"tdp\": 60}");

            createProduct("Intel Core i5-12400F", 6500.0, categories.get("Процесори"),
                    "https://content2.rozetka.com.ua/goods/images/big/505102949.jpg",
                    "6 ядер, 12 потоків — топ за свої гроші.",
                    "{\"socket\": \"LGA1700\", \"cores\": 6, \"frequency\": \"2.5GHz\", \"tdp\": 65}");

            createProduct("Intel Core i7-12700KF", 14500.0, categories.get("Процесори"),
                    "https://content2.rozetka.com.ua/goods/images/big/231753862.jpg",
                    "Для важких задач, монтажу та ігор.",
                    "{\"socket\": \"LGA1700\", \"cores\": 12, \"frequency\": \"2.7GHz\", \"tdp\": 125}");

            createProduct("Intel Core i9-13900K", 24000.0, categories.get("Процесори"),
                    "https://content2.rozetka.com.ua/goods/images/big/366096830.jpg",
                    "Флагман Intel, максимум продуктивності.",
                    "{\"socket\": \"LGA1700\", \"cores\": 24, \"frequency\": \"3.0GHz\", \"tdp\": 125}");

            createProduct("AMD Ryzen 3 4100", 3200.0, categories.get("Процесори"),
                    "https://content.rozetka.com.ua/goods/images/big/491904129.jpg",
                    "Дуже бюджетний варіант.",
                    "{\"socket\": \"AM4\", \"cores\": 4, \"frequency\": \"3.8GHz\", \"tdp\": 65}");

            createProduct("AMD Ryzen 5 5500", 4800.0, categories.get("Процесори"),
                    "https://content.rozetka.com.ua/goods/images/big/368595442.jpg",
                    "Оптимальний процесор для бюджетного ПК.",
                    "{\"socket\": \"AM4\", \"cores\": 6, \"frequency\": \"3.6GHz\", \"tdp\": 65}");

            createProduct("AMD Ryzen 5 5600", 5800.0, categories.get("Процесори"),
                    "https://content2.rozetka.com.ua/goods/images/big/557170234.jpg",
                    "Народний вибір для AM4.",
                    "{\"socket\": \"AM4\", \"cores\": 6, \"frequency\": \"3.5GHz\", \"tdp\": 65}");

            createProduct("AMD Ryzen 7 5800X3D", 11000.0, categories.get("Процесори"),
                    "https://content2.rozetka.com.ua/goods/images/big/510976566.jpg",
                    "Один із найкращих ігрових процесорів.",
                    "{\"socket\": \"AM4\", \"cores\": 8, \"frequency\": \"3.4GHz\", \"tdp\": 105}");

            createProduct("AMD Ryzen 7 7700X", 15000.0, categories.get("Процесори"),
                    "https://content1.rozetka.com.ua/goods/images/big/492378402.jpg",
                    "Сучасний топ для AM5.",
                    "{\"socket\": \"AM5\", \"cores\": 8, \"frequency\": \"4.5GHz\", \"tdp\": 105}");

            createProduct("AMD Ryzen 9 7950X", 25000.0, categories.get("Процесори"),
                    "https://content2.rozetka.com.ua/goods/images/big/484926739.jpg",
                    "Монстр для рендера та ігор.",
                    "{\"socket\": \"AM5\", \"cores\": 16, \"frequency\": \"4.7GHz\", \"tdp\": 170}");

            // --- МАТЕРИНСЬКІ ПЛАТИ ---
            createProduct("ASUS Prime B660M-K", 4200.0, categories.get("Материнські плати"),
                    "https://content1.rozetka.com.ua/goods/images/big/246231601.jpg",
                    "Надійна база під Intel 12/13gen.",
                    "{\"socket\": \"LGA1700\", \"form_factor\": \"mATX\", \"ram_slots\": 2}");

            createProduct("Gigabyte B660 DS3H AX", 5200.0, categories.get("Материнські плати"),
                    "https://content1.rozetka.com.ua/goods/images/big/491875749.jpg",
                    "Wi-Fi + PCI-E 4.0.",
                    "{\"socket\": \"LGA1700\", \"form_factor\": \"ATX\", \"ram_slots\": 4}");

            createProduct("MSI PRO B760M-A", 5800.0, categories.get("Материнські плати"),
                    "https://content1.rozetka.com.ua/goods/images/big/306635644.jpg",
                    "Під Intel 14gen.",
                    "{\"socket\": \"LGA1700\", \"form_factor\": \"mATX\", \"ram_slots\": 4}");

            createProduct("ASUS ROG Strix Z690-F", 11500.0, categories.get("Материнські плати"),
                    "https://content2.rozetka.com.ua/goods/images/big/355308752.jpg",
                    "Преміум для ентузіастів.",
                    "{\"socket\": \"LGA1700\", \"form_factor\": \"ATX\", \"ram_slots\": 4}");

            createProduct("Gigabyte B550 Gaming X", 4900.0, categories.get("Материнські плати"),
                    "https://content1.rozetka.com.ua/goods/images/big/314966763.png",
                    "Оптимальна AM4 плата.",
                    "{\"socket\": \"AM4\", \"form_factor\": \"ATX\", \"ram_slots\": 4}");

            createProduct("MSI B450 Tomahawk Max II", 4100.0, categories.get("Материнські плати"),
                    "https://content1.rozetka.com.ua/goods/images/big/492715394.jpg",
                    "Найпопулярніша AM4 плата.",
                    "{\"socket\": \"AM4\", \"form_factor\": \"ATX\", \"ram_slots\": 4}");

            createProduct("ASRock B650M Pro RS", 7800.0, categories.get("Материнські плати"),
                    "https://content.rozetka.com.ua/goods/images/big/586789735.jpg",
                    "Під Ryzen 7000.",
                    "{\"socket\": \"AM5\", \"form_factor\": \"mATX\", \"ram_slots\": 4}");

            createProduct("ASUS TUF Gaming X670E", 15000.0, categories.get("Материнські плати"),
                    "https://content2.rozetka.com.ua/goods/images/big/491880185.jpg",
                    "Флагман AM5.",
                    "{\"socket\": \"AM5\", \"form_factor\": \"ATX\", \"ram_slots\": 4}");

            createProduct("Gigabyte A520M S2H", 2300.0, categories.get("Материнські плати"),
                    "https://content2.rozetka.com.ua/goods/images/big/524560194.jpg",
                    "Супербюджет для AM4.",
                    "{\"socket\": \"AM4\", \"form_factor\": \"mATX\", \"ram_slots\": 2}");

            createProduct("MSI MPG X570 Gaming Edge WiFi", 8200.0, categories.get("Материнські плати"),
                    "https://content1.rozetka.com.ua/goods/images/big/188871643.jpg",
                    "Wi-Fi + PCI-E 4.0.",
                    "{\"socket\": \"AM4\", \"form_factor\": \"ATX\", \"ram_slots\": 4}");

            // --- ВІДЕОКАРТИ ---
            createProduct("NVIDIA GeForce GTX 1650", 6500.0, categories.get("Відеокарти"),
                    "https://content2.rozetka.com.ua/goods/images/big/516332431.jpg",
                    "Бюджетна карта для онлайн-ігор.",
                    "{\"memory\": \"4GB\", \"type\": \"GDDR5\", \"power_req\": \"300W\"}");

            createProduct("NVIDIA GeForce GTX 1660 Super", 9000.0, categories.get("Відеокарти"),
                    "https://content1.rozetka.com.ua/goods/images/big/627766035.jpg",
                    "Чудовий варіант для FullHD.",
                    "{\"memory\": \"6GB\", \"type\": \"GDDR6\", \"power_req\": \"450W\"}");

            createProduct("NVIDIA GeForce RTX 3050", 11500.0, categories.get("Відеокарти"),
                    "https://content2.rozetka.com.ua/goods/images/big/406762262.jpg",
                    "Базовий рівень RTX.",
                    "{\"memory\": \"8GB\", \"type\": \"GDDR6\", \"power_req\": \"500W\"}");

            createProduct("NVIDIA GeForce RTX 3060", 14500.0, categories.get("Відеокарти"),
                    "https://content2.rozetka.com.ua/goods/images/big/298282571.jpg",
                    "Ідеальний FullHD Ultra.",
                    "{\"memory\": \"12GB\", \"type\": \"GDDR6\", \"power_req\": \"550W\"}");

            createProduct("NVIDIA GeForce RTX 4060", 13500.0, categories.get("Відеокарти"),
                    "https://content.rozetka.com.ua/goods/images/big/540284978.jpg",
                    "Сучасний бюджетний RTX.",
                    "{\"memory\": \"8GB\", \"type\": \"GDDR6\", \"power_req\": \"550W\"}");

            createProduct("NVIDIA GeForce RTX 4070", 26000.0, categories.get("Відеокарти"),
                    "https://content.rozetka.com.ua/goods/images/big/327358678.jpg",
                    "WQHD ігри без проблем.",
                    "{\"memory\": \"12GB\", \"type\": \"GDDR6X\", \"power_req\": \"650W\"}");

            createProduct("NVIDIA GeForce RTX 4080", 45000.0, categories.get("Відеокарти"),
                    "https://content.rozetka.com.ua/goods/images/big/387746618.jpg",
                    "4K ігри на ультра.",
                    "{\"memory\": \"16GB\", \"type\": \"GDDR6X\", \"power_req\": \"750W\"}");

            createProduct("NVIDIA GeForce RTX 4090", 85000.0, categories.get("Відеокарти"),
                    "https://content1.rozetka.com.ua/goods/images/big/423523091.jpg",
                    "Найпотужніша відеокарта у світі.",
                    "{\"memory\": \"24GB\", \"type\": \"GDDR6X\", \"power_req\": \"1000W\"}");

            createProduct("AMD Radeon RX 6600", 10500.0, categories.get("Відеокарти"),
                    "https://content1.rozetka.com.ua/goods/images/big/589095405.jpg",
                    "Чудовий FullHD рішення.",
                    "{\"memory\": \"8GB\", \"type\": \"GDDR6\", \"power_req\": \"500W\"}");

            createProduct("AMD Radeon RX 6800 XT", 35000.0, categories.get("Відеокарти"),
                    "https://content2.rozetka.com.ua/goods/images/big/614594099.webp",
                    "4K рівень для геймінгу.",
                    "{\"memory\": \"16GB\", \"type\": \"GDDR6\", \"power_req\": \"750W\"}");

            // ОЗУ
            createProduct("Kingston Fury Beast 8GB 3200MHz", 900.0, categories.get("ОЗУ"),
                    "https://content.rozetka.com.ua/goods/images/big/616839159.jpg",
                    "Бюджетна памʼять для ПК.",
                    "{\"capacity\": \"8GB\", \"frequency\": \"3200MHz\", \"type\": \"DDR4\"}");

            createProduct("Kingston Fury Beast 16GB 3200MHz", 1650.0, categories.get("ОЗУ"),
                    "https://content.rozetka.com.ua/goods/images/big/616838816.jpg",
                    "Оптимальна конфігурація 16GB.",
                    "{\"capacity\": \"16GB\", \"frequency\": \"3200MHz\", \"type\": \"DDR4\"}");

            createProduct("Corsair Vengeance LPX 16GB 3600MHz", 2100.0, categories.get("ОЗУ"),
                    "https://content1.rozetka.com.ua/goods/images/big/405128962.jpg",
                    "Висока частота для геймінгу.",
                    "{\"capacity\": \"16GB\", \"frequency\": \"3600MHz\", \"type\": \"DDR4\"}");

            createProduct("HyperX Predator 16GB 4000MHz", 2600.0, categories.get("ОЗУ"),
                    "https://content.rozetka.com.ua/goods/images/big/610381186.jpg",
                    "Для оверклокерів.",
                    "{\"capacity\": \"16GB\", \"frequency\": \"4000MHz\", \"type\": \"DDR4\"}");

            createProduct("ADATA XPG Spectrix 16GB 3200MHz RGB", 2300.0, categories.get("ОЗУ"),
                    "https://content.rozetka.com.ua/goods/images/big/318053523.jpg",
                    "Яскраве RGB + стабільність.",
                    "{\"capacity\": \"16GB\", \"frequency\": \"3200MHz\", \"type\": \"DDR4\", \"rgb\": true}");

            createProduct("Kingston Fury Beast 32GB 3600MHz", 3900.0, categories.get("ОЗУ"),
                    "https://content1.rozetka.com.ua/goods/images/big/592617676.png",
                    "Для роботи та важких задач.",
                    "{\"capacity\": \"32GB\", \"frequency\": \"3600MHz\", \"type\": \"DDR4\"}");

            createProduct("Corsair Vengeance RGB Pro 32GB 3200MHz", 4200.0, categories.get("ОЗУ"),
                    "https://content1.rozetka.com.ua/goods/images/big/461524559.jpg",
                    "Яскраве RGB та висока якість.",
                    "{\"capacity\": \"32GB\", \"frequency\": \"3200MHz\", \"type\": \"DDR4\", \"rgb\": true}");

            createProduct("Kingston Fury Beast 32GB 6000MHz DDR5", 6200.0, categories.get("ОЗУ"),
                    "https://content.rozetka.com.ua/goods/images/big/616300934.jpg",
                    "Сучасна DDR5 памʼять.",
                    "{\"capacity\": \"32GB\", \"frequency\": \"6000MHz\", \"type\": \"DDR5\"}");

            createProduct("Corsair Dominator Platinum 32GB 5600MHz DDR5", 7200.0, categories.get("ОЗУ"),
                    "https://content1.rozetka.com.ua/goods/images/big/321445878.jpg",
                    "Преміум сегмент.",
                    "{\"capacity\": \"32GB\", \"frequency\": \"5600MHz\", \"type\": \"DDR5\", \"rgb\": true}");

            createProduct("G.Skill Trident Z5 RGB 32GB 6000MHz DDR5", 7500.0, categories.get("ОЗУ"),
                    "https://content1.rozetka.com.ua/goods/images/big/571541117.jpg",
                    "Максимум продуктивності.",
                    "{\"capacity\": \"32GB\", \"frequency\": \"6000MHz\", \"type\": \"DDR5\", \"rgb\": true}");

            // --- SSD ---
            createProduct("Kingston A2000 500GB NVMe", 1500.0, categories.get("SSD накопичувачі"),
                    "https://content2.rozetka.com.ua/goods/images/big/161082163.jpg",
                    "NVMe SSD — швидкий та бюджетний.",
                    "{\"capacity\": \"500GB\", \"interface\": \"NVMe\", \"read\": \"2200MB/s\", \"write\": \"2000MB/s\"}");

            createProduct("Samsung 970 EVO Plus 1TB", 4200.0, categories.get("SSD накопичувачі"),
                    "https://content2.rozetka.com.ua/goods/images/big/504103198.jpg",
                    "Надійний та швидкий PCIe 3.0 NVMe.",
                    "{\"capacity\": \"1TB\", \"interface\": \"NVMe\", \"read\": \"3500MB/s\", \"write\": \"3300MB/s\"}");

            createProduct("WD Blue SN570 1TB", 3800.0, categories.get("SSD накопичувачі"),
                    "https://content.rozetka.com.ua/goods/images/big/557757884.jpg",
                    "Оптимальний баланс ціни та швидкості.",
                    "{\"capacity\": \"1TB\", \"interface\": \"NVMe\", \"read\": \"3400MB/s\", \"write\": \"3000MB/s\"}");

            createProduct("Crucial P3 500GB NVMe", 1400.0, categories.get("SSD накопичувачі"),
                    "https://content1.rozetka.com.ua/goods/images/big/620685653.jpg",
                    "Бюджетний NVMe для щоденних задач.",
                    "{\"capacity\": \"500GB\", \"interface\": \"NVMe\", \"read\": \"3500MB/s\", \"write\": \"2000MB/s\"}");

            createProduct("Samsung 980 Pro 1TB", 6200.0, categories.get("SSD накопичувачі"),
                    "https://content.rozetka.com.ua/goods/images/big/348923555.jpg",
                    "Топовий NVMe для високих навантажень.",
                    "{\"capacity\": \"1TB\", \"interface\": \"NVMe\", \"read\": \"7000MB/s\", \"write\": \"5000MB/s\"}");

            createProduct("Kingston KC600 1TB SATA", 2200.0, categories.get("SSD накопичувачі"),
                    "https://content2.rozetka.com.ua/goods/images/big/171286580.jpg",
                    "SATA SSD — відмінний апгрейд для старих систем.",
                    "{\"capacity\": \"1TB\", \"interface\": \"SATA\", \"read\": \"550MB/s\", \"write\": \"520MB/s\"}");

            createProduct("Crucial MX500 1TB SATA", 2100.0, categories.get("SSD накопичувачі"),
                    "https://content.rozetka.com.ua/goods/images/big/441548543.jpg",
                    "Надійний SATA SSD з хорошою витривалістю.",
                    "{\"capacity\": \"1TB\", \"interface\": \"SATA\", \"read\": \"560MB/s\", \"write\": \"510MB/s\"}");

            createProduct("Seagate FireCuda 510 1TB NVMe", 4000.0, categories.get("SSD накопичувачі"),
                    "https://content2.rozetka.com.ua/goods/images/big/425227488.jpg",
                    "NVMe для геймерів з великою витривалістю.",
                    "{\"capacity\": \"1TB\", \"interface\": \"NVMe\", \"read\": \"5000MB/s\", \"write\": \"4400MB/s\"}");

            createProduct("Adata XPG SX8200 Pro 1TB", 3900.0, categories.get("SSD накопичувачі"),
                    "https://content.rozetka.com.ua/goods/images/big/13040635.jpg",
                    "Висока продуктивність за помірну ціну.",
                    "{\"capacity\": \"1TB\", \"interface\": \"NVMe\", \"read\": \"3500MB/s\", \"write\": \"3000MB/s\"}");

            createProduct("WD Black SN850 1TB", 5800.0, categories.get("SSD накопичувачі"),
                    "https://content1.rozetka.com.ua/goods/images/big/437272987.jpg",
                    "Топовий NVMe для геймінгу і рендеру.",
                    "{\"capacity\": \"1TB\", \"interface\": \"NVMe\", \"read\": \"7000MB/s\", \"write\": \"5300MB/s\"}");

            // БЛОКИ ЖИВЛЕННЯ
            createProduct("Corsair CX550M 550W", 2200.0, categories.get("Блоки живлення"),
                    "https://content1.rozetka.com.ua/goods/images/big/282364424.jpg",
                    "Надійний блок живлення для середнього ПК.",
                    "{\"watt\": \"550W\", \"efficiency\": \"80+ Bronze\", \"modular\": \"semi-modular\"}");

            createProduct("Seasonic S12III 650W", 3000.0, categories.get("Блоки живлення"),
                    "https://content1.rozetka.com.ua/goods/images/big/45819982.jpg",
                    "Висока якість та надійність.",
                    "{\"watt\": \"650W\", \"efficiency\": \"80+ Bronze\", \"modular\": \"no\"}");

            createProduct("Be Quiet! Pure Power 11 500W", 2600.0, categories.get("Блоки живлення"),
                    "https://content.rozetka.com.ua/goods/images/big/300232864.jpg",
                    "Тихий і ефективний блок живлення.",
                    "{\"watt\": \"500W\", \"efficiency\": \"80+ Gold\", \"modular\": \"no\"}");

            createProduct("EVGA SuperNOVA 750 G6", 5200.0, categories.get("Блоки живлення"),
                    "https://content2.rozetka.com.ua/goods/images/big/446514978.jpg",
                    "Преміум блок для потужних систем.",
                    "{\"watt\": \"750W\", \"efficiency\": \"80+ Gold\", \"modular\": \"full-modular\"}");

            createProduct("Cooler Master MWE Gold 650W", 3400.0, categories.get("Блоки живлення"),
                    "https://content1.rozetka.com.ua/goods/images/big/225983344.jpg",
                    "Баланс ціни та якості.",
                    "{\"watt\": \"650W\", \"efficiency\": \"80+ Gold\", \"modular\": \"semi-modular\"}");

            createProduct("Thermaltake Toughpower GF1 850W", 6800.0, categories.get("Блоки живлення"),
                    "https://content.rozetka.com.ua/goods/images/big/441713519.jpg",
                    "Для ентузіастів і 4090/7950X систем.",
                    "{\"watt\": \"850W\", \"efficiency\": \"80+ Gold\", \"modular\": \"full-modular\"}");

            createProduct("FSP Hydro GE 650W", 3100.0, categories.get("Блоки живлення"),
                    "https://content1.rozetka.com.ua/goods/images/big/586991058.jpg",
                    "Надійне рішення для ігрових збірок.",
                    "{\"watt\": \"650W\", \"efficiency\": \"80+ Bronze\", \"modular\": \"no\"}");

            createProduct("Antec Earthwatts Gold Pro 750W", 4200.0, categories.get("Блоки живлення"),
                    "https://content1.rozetka.com.ua/goods/images/big/107872981.jpg",
                    "Хороший вибір для тих, хто хоче Gold сертифікацію.",
                    "{\"watt\": \"750W\", \"efficiency\": \"80+ Gold\", \"modular\": \"semi-modular\"}");

            createProduct("SilverStone Strider 1200W", 12500.0, categories.get("Блоки живлення"),
                    "https://content2.rozetka.com.ua/goods/images/big/248003758.jpg",
                    "Для мульти-GPU та серверних конфігурацій.",
                    "{\"watt\": \"1200W\", \"efficiency\": \"80+ Platinum\", \"modular\": \"full-modular\"}");

            createProduct("ASUS ROG Thor 850W", 14500.0, categories.get("Блоки живлення"),
                    "https://content1.rozetka.com.ua/goods/images/big/579573811.png",
                    "Преміум блок з OLED-панеллю.",
                    "{\"watt\": \"850W\", \"efficiency\": \"80+ Platinum\", \"modular\": \"full-modular\"}");

            // 10 КОРПУСІВ
            createProduct("NZXT H510", 4200.0, categories.get("Корпуси"),
                    "https://content2.rozetka.com.ua/goods/images/big/530104632.jpg",
                    "Популярний мінімалістичний корпус.",
                    "{\"form_factor\": \"ATX\",\"front\": \"glass\",\"max_gpu_length\": \"381mm\"}");

            createProduct("Corsair 4000D Airflow", 4700.0, categories.get("Корпуси"),
                    "https://content.rozetka.com.ua/goods/images/big/442156608.jpg",
                    "Відмінна продувність і простір для компонентів.",
                    "{\"form_factor\": \"ATX\",\"front\": \"mesh\",\"max_gpu_length\": \"360mm\"}");

            createProduct("Fractal Design Meshify C", 4600.0, categories.get("Корпуси"),
                    "https://content2.rozetka.com.ua/goods/images/big/401089345.jpg",
                    "Компактний і дуже продуктивний по охолодженню.",
                    "{\"form_factor\": \"ATX\",\"front\": \"mesh\",\"max_gpu_length\": \"315mm\"}");

            createProduct("Phanteks Eclipse P400A", 3900.0, categories.get("Корпуси"),
                    "https://content.rozetka.com.ua/goods/images/big/442153063.jpg",
                    "Підтримка RGB і хороша продувність.",
                    "{\"form_factor\": \"ATX\",\"front\": \"mesh\",\"max_gpu_length\": \"420mm\"}");

            createProduct("Lian Li Lancool II", 6800.0, categories.get("Корпуси"),
                    "https://content2.rozetka.com.ua/goods/images/big/503815512.jpg",
                    "Якісний корпус з чудовим дизайном.",
                    "{\"form_factor\": \"ATX\",\"front\": \"mesh\",\"max_gpu_length\": \"360mm\"}");

            createProduct("Cooler Master NR600", 3200.0, categories.get("Корпуси"),
                    "https://content1.rozetka.com.ua/goods/images/big/442138923.jpg",
                    "Бюджетний корпус з хорошою продувністю.",
                    "{\"form_factor\": \"ATX\",\"front\": \"mesh\",\"max_gpu_length\": \"410mm\"}");

            createProduct("Thermaltake H200 TG", 2800.0, categories.get("Корпуси"),
                    "https://content.rozetka.com.ua/goods/images/big/361185102.jpg",
                    "Стильний корпус з загартованим склом.",
                    "{\"form_factor\": \"ATX\",\"front\": \"glass\",\"max_gpu_length\": \"330mm\"}");

            createProduct("be quiet! Pure Base 500DX", 5100.0, categories.get("Корпуси"),
                    "https://content1.rozetka.com.ua/goods/images/big/442169947.jpg",
                    "Тихий корпус з хорошою вентиляцією.",
                    "{\"form_factor\": \"ATX\",\"front\": \"mesh\",\"max_gpu_length\": \"369mm\"}");

            createProduct("Coolermaster MasterBox NR200", 3600.0, categories.get("Корпуси"),
                    "https://content.rozetka.com.ua/goods/images/big/391843378.jpg",
                    "Компактний SFF корпус з відмінним дизайном.",
                    "{\"form_factor\": \"mATX\",\"front\": \"mesh\",\"max_gpu_length\": \"330mm\"}");

            createProduct("Corsair Obsidian Series 1000D", 29500.0, categories.get("Корпуси"),
                    "https://content2.rozetka.com.ua/goods/images/big/438445994.jpg",
                    "Великий корпус для екстремальних збірок.",
                    "{\"form_factor\": \"E-ATX\",\"front\": \"glass\",\"max_gpu_length\": \"480mm\"}");

            // 10 МОНІТОРІВ
            createProduct("Samsung Odyssey G3 24\"", 6200.0, categories.get("Монітори"),
                    "https://content1.rozetka.com.ua/goods/images/big/575065940.jpg",
                    "144Hz бюджетний ігровий монітор.",
                    "{\"resolution\": \"1920x1080\", \"refresh_rate\": \"144Hz\", \"panel\": \"VA\"}");

            createProduct("Samsung Odyssey G5 27\"", 11000.0, categories.get("Монітори"),
                    "https://content1.rozetka.com.ua/goods/images/big/575064385.jpg",
                    "Вигнутий 1440p 144Hz.",
                    "{\"resolution\": \"2560x1440\", \"refresh_rate\": \"144Hz\", \"panel\": \"VA\"}");

            createProduct("Dell P2422H 24\"", 7500.0, categories.get("Монітори"),
                    "https://content1.rozetka.com.ua/goods/images/big/575584166.jpg",
                    "Професійний IPS монітор.",
                    "{\"resolution\": \"1920x1080\", \"refresh_rate\": \"60Hz\", \"panel\": \"IPS\"}");

            createProduct("LG UltraGear 24GN600", 6900.0, categories.get("Монітори"),
                    "https://content.rozetka.com.ua/goods/images/big/310558646.jpg",
                    "Ігровий IPS 144Hz.",
                    "{\"resolution\": \"1920x1080\", \"refresh_rate\": \"144Hz\", \"panel\": \"IPS\"}");

            createProduct("LG UltraGear 27GN800", 12500.0, categories.get("Монітори"),
                    "https://content.rozetka.com.ua/goods/images/big/621850037.webp",
                    "27\" IPS 144Hz.",
                    "{\"resolution\": \"2560x1440\", \"refresh_rate\": \"144Hz\", \"panel\": \"IPS\"}");

            createProduct("AOC 24G2U", 6800.0, categories.get("Монітори"),
                    "https://content1.rozetka.com.ua/goods/images/big/246567498.jpg",
                    "Топовий бюджетний 144Hz IPS.",
                    "{\"resolution\": \"1920x1080\", \"refresh_rate\": \"144Hz\", \"panel\": \"IPS\"}");

            createProduct("ASUS TUF VG249Q", 7600.0, categories.get("Монітори"),
                    "https://content.rozetka.com.ua/goods/images/big/580724167.jpg",
                    "IPS 144Hz + адаптивна синхронізація.",
                    "{\"resolution\": \"1920x1080\", \"refresh_rate\": \"144Hz\", \"panel\": \"IPS\"}");

            createProduct("ASUS TUF VG27AQ", 14500.0, categories.get("Монітори"),
                    "https://content.rozetka.com.ua/goods/images/big/411396352.jpg",
                    "WQHD 165Hz IPS.",
                    "{\"resolution\": \"2560x1440\", \"refresh_rate\": \"165Hz\", \"panel\": \"IPS\"}");

            createProduct("MSI Optix G241", 6900.0, categories.get("Монітори"),
                    "https://content2.rozetka.com.ua/goods/images/big/556578123.jpg",
                    "Чудовий бюджетний IPS.",
                    "{\"resolution\": \"1920x1080\", \"refresh_rate\": \"144Hz\", \"panel\": \"IPS\"}");

            createProduct("Xiaomi Mi Curved 34", 14500.0, categories.get("Монітори"),
                    "https://content.rozetka.com.ua/goods/images/big/520053792.jpg",
                    "Ультраширокий 144Hz VA.",
                    "{\"resolution\": \"3440x1440\", \"refresh_rate\": \"144Hz\", \"panel\": \"VA\"}");

            // 10 КЛАВІАТУР
            createProduct("Logitech K120", 350.0, categories.get("Клавіатури"),
                    "https://content1.rozetka.com.ua/goods/images/big/322547977.png",
                    "Проста мембранна клавіатура.",
                    "{\"type\": \"Membrane\", \"layout\": \"UKR\"}");

            createProduct("Logitech G213 Prodigy", 1650.0, categories.get("Клавіатури"),
                    "https://content.rozetka.com.ua/goods/images/big/239858915.jpg",
                    "Ігрова мембранна з RGB.",
                    "{\"type\": \"Membrane\", \"rgb\": true, \"layout\": \"UKR\"}");

            createProduct("HyperX Alloy Origins", 4500.0, categories.get("Клавіатури"),
                    "https://content.rozetka.com.ua/goods/images/big/317636024.jpg",
                    "Механічна клавіатура.",
                    "{\"switch\": \"Red\", \"type\": \"Mechanical\", \"layout\": \"UKR\"}");

            createProduct("Razer Huntsman Mini", 5200.0, categories.get("Клавіатури"),
                    "https://content1.rozetka.com.ua/goods/images/big/486610966.jpg",
                    "Компактна 60% механіка.",
                    "{\"switch\": \"Optical\", \"type\": \"Mechanical\", \"layout\": \"ENG\"}");

            createProduct("Razer BlackWidow V3", 5300.0, categories.get("Клавіатури"),
                    "https://content.rozetka.com.ua/goods/images/big/30403514.jpg",
                    "Топова механіка.",
                    "{\"switch\": \"Green\", \"type\": \"Mechanical\", \"rgb\": true}");

            createProduct("SteelSeries Apex 3", 2100.0, categories.get("Клавіатури"),
                    "https://content.rozetka.com.ua/goods/images/big/571540606.png",
                    "Вологостійка мембранна.",
                    "{\"type\": \"Membrane\", \"rgb\": true}");

            createProduct("SteelSeries Apex Pro", 8500.0, categories.get("Клавіатури"),
                    "https://content2.rozetka.com.ua/goods/images/big/527455433.jpg",
                    "Одна з найкращих клавіатур.",
                    "{\"type\": \"Mechanical\", \"switch\": \"OmniPoint\"}");

            createProduct("Corsair K55 RGB Pro", 1900.0, categories.get("Клавіатури"),
                    "https://content1.rozetka.com.ua/goods/images/big/543163452.jpg",
                    "Мембранна RGB.",
                    "{\"type\": \"Membrane\", \"rgb\": true}");

            createProduct("Corsair K70 RGB MK.2", 6200.0, categories.get("Клавіатури"),
                    "https://content1.rozetka.com.ua/goods/images/big/543163452.jpg",
                    "Механічна флагманська модель.",
                    "{\"type\": \"Mechanical\", \"switch\": \"Red\", \"rgb\": true}");

            createProduct("Keychron K2 V2", 3600.0, categories.get("Клавіатури"),
                    "https://content2.rozetka.com.ua/goods/images/big/508904291.jpg",
                    "Бездротова механіка.",
                    "{\"type\": \"Mechanical\", \"wireless\": true}");

            // 10 МИШОК
            createProduct("Logitech G102 Lightsync", 1200.0, categories.get("Мишки"),
                    "https://content1.rozetka.com.ua/goods/images/big/24709323.jpg",
                    "Легендарна бюджетна миша.",
                    "{\"dpi\": 8000, \"buttons\": 6, \"rgb\": true}");

            createProduct("Logitech G305 Lightspeed", 1800.0, categories.get("Мишки"),
                    "https://content1.rozetka.com.ua/goods/images/big/252395009.jpg",
                    "Одна з кращих бездротових бюджетних.",
                    "{\"dpi\": 12000, \"wireless\": true}");

            createProduct("Logitech G502 Hero", 2400.0, categories.get("Мишки"),
                    "https://content1.rozetka.com.ua/goods/images/big/626866514.jpg",
                    "Культова FPS миша.",
                    "{\"dpi\": 25600, \"buttons\": 11}");

            createProduct("Razer DeathAdder Essential", 900.0, categories.get("Мишки"),
                    "https://content.rozetka.com.ua/goods/images/big/12934233.jpg",
                    "Класика від Razer.",
                    "{\"dpi\": 6400, \"buttons\": 5}");

            createProduct("Razer Viper Mini", 1500.0, categories.get("Мишки"),
                    "https://content1.rozetka.com.ua/goods/images/big/577968798.webp",
                    "Легка та швидка.",
                    "{\"dpi\": 8500, \"buttons\": 6}");

            createProduct("Razer Basilisk V3", 2600.0, categories.get("Мишки"),
                    "https://content1.rozetka.com.ua/goods/images/big/505122097.jpg",
                    "Преміум з RGB та сенсором Focus+.",
                    "{\"dpi\": 26000, \"rgb\": true}");

            createProduct("SteelSeries Rival 3", 1200.0, categories.get("Мишки"),
                    "https://content2.rozetka.com.ua/goods/images/big/556503284.jpg",
                    "Топ за свої гроші.",
                    "{\"dpi\": 8500}");

            createProduct("SteelSeries Aerox 3 Wireless", 3400.0, categories.get("Мишки"),
                    "https://content1.rozetka.com.ua/goods/images/big/426220752.jpg",
                    "Легкість і бездротовість.",
                    "{\"dpi\": 18000, \"wireless\": true}");

            createProduct("Xiaomi Mi Wireless Mouse Lite", 350.0, categories.get("Мишки"),
                    "https://content.rozetka.com.ua/goods/images/big/498510520.jpg",
                    "Дешева офісна миша.",
                    "{\"dpi\": 1200, \"wireless\": true}");

            createProduct("Asus ROG Gladius III", 3900.0, categories.get("Мишки"),
                    "https://content1.rozetka.com.ua/goods/images/big/311768056.jpg",
                    "Професійна FPS миша.",
                    "{\"dpi\": 26000, \"rgb\": true}");


            // ПОСЛУГА ЗБІРКИ
            createProduct("Перевірка сумісності, Збірка ПК та тестування", 1.0, categories.get("Послуги"),
                    "https://cdn-icons-png.flaticon.com/512/3096/3096998.png",
                    "Професійна збірка вашого комп'ютера.",
                    "{\"service\": true}");

            System.out.println("--- БАЗА ДАНИХ ЗАПОВНЕНА ---");
        }
    }

    private void createProduct(String name, Double price, Category category, String img, String desc, String specs) {
        Product p = new Product();
        p.setName(name);
        p.setPrice(price);
        p.setCategory(category);
        p.setImageUrl(img);
        p.setDescription(desc);
        p.setSpecifications(specs);
        productRepository.save(p);
    }
}