package com.gopalkundu.leettracker.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gopalkundu.leettracker.entity.Question;
import com.gopalkundu.leettracker.services.QuestionService;

@RestController
@RequestMapping("api/questions/")
public class QuestionController {

    @Autowired
    private QuestionService questionService;

    @PostMapping("/bulk")
    public String addQuestions(@RequestBody List<Question> question){
        return questionService.addQuestionsInBulk(question);
    }
}
