package com.coursework.pc_configurator.service;

import com.coursework.pc_configurator.model.Product;
import com.coursework.pc_configurator.repository.ProductRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ConfiguratorService {

    private final ProductRepository productRepository;
    private final ObjectMapper objectMapper;

    // Метод перевірки сумісності
    public Map<String, Object> checkCompatibility(Long cpuId, Long motherboardId) {
        Map<String, Object> result = new HashMap<>();

        try {
            // 1. Дістаємо товари з бази
            Product cpu = productRepository.findById(cpuId)
                    .orElseThrow(() -> new RuntimeException("CPU не знайдено"));
            Product motherboard = productRepository.findById(motherboardId)
                    .orElseThrow(() -> new RuntimeException("Материнську плату не знайдено"));

            // 2. Парсимо JSON характеристики
            JsonNode cpuSpecs = objectMapper.readTree(cpu.getSpecifications());
            JsonNode moboSpecs = objectMapper.readTree(motherboard.getSpecifications());

            // 3. ПЕРЕВІРКА: Сокет
            String cpuSocket = cpuSpecs.get("socket").asText();
            String moboSocket = moboSpecs.get("socket").asText();

            if (cpuSocket.equals(moboSocket)) {
                result.put("compatible", true);
                result.put("message", "✅ Чудово! Процесор і плата сумісні (Сокет " + cpuSocket + ")");
            } else {
                result.put("compatible", false);
                result.put("message", "❌ Помилка! Несумісні сокети. CPU: " + cpuSocket + ", Плата: " + moboSocket);
            }

        } catch (JsonProcessingException e) {
            result.put("compatible", false);
            result.put("message", "Помилка обробки даних (невірний JSON формат)");
        } catch (Exception e) {
            result.put("compatible", false);
            result.put("message", e.getMessage());
        }

        return result;
    }
}