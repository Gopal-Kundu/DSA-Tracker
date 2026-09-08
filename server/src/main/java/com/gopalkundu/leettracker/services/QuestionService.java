package com.gopalkundu.leettracker.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gopalkundu.leettracker.entity.Question;
import com.gopalkundu.leettracker.repositories.QuestionRepository;

@Service
public class QuestionService {
    @Autowired
    private QuestionRepository questionRepository;

    public String addQuestionsInBulk(List<Question> question){
        try{
            
            questionRepository.saveAll(question);
            return "All Question Moved";
        }catch(Exception e){
            return "Error" + e;
        }
    }
}
