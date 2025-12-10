package com.coursework.pc_configurator.repository;

import com.coursework.pc_configurator.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CategoryRepository extends JpaRepository<Category, Long> {
    Category findByName(String name);
}