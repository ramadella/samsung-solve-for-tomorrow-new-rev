# genetic_algorithm.py

from deap import base, creator, tools, algorithms
import random

# Genetic Algorithm parameters
POPULATION_SIZE = 100
GENERATIONS = 50
CROSSOVER_PROB = 0.7
MUTATION_PROB = 0.2

def predict_fuel(waste_composition):
    """
    Simulated fuel prediction based on waste composition.
    In a real scenario, this would be a more complex model.
    """
    return sum(w * random.uniform(0.5, 1.5) for w in waste_composition)

def setup_genetic_algorithm(num_waste_types):
    creator.create("FitnessMax", base.Fitness, weights=(1.0,))
    creator.create("Individual", list, fitness=creator.FitnessMax)

    toolbox = base.Toolbox()
    toolbox.register("attr_float", random.random)
    toolbox.register("individual", tools.initRepeat, creator.Individual, toolbox.attr_float, n=num_waste_types)
    toolbox.register("population", tools.initRepeat, list, toolbox.individual)

    toolbox.register("evaluate", evaluate)
    toolbox.register("mate", tools.cxTwoPoint)
    toolbox.register("mutate", tools.mutGaussian, mu=0, sigma=0.2, indpb=0.2)
    toolbox.register("select", tools.selTournament, tournsize=3)

    return toolbox

def evaluate(individual):
    return (predict_fuel(individual),)

def genetic_algorithm_fuel_prediction(waste_types):
    """
    Run genetic algorithm to optimize fuel prediction based on waste composition.
    
    :param waste_types: List of waste types
    :return: Best individual (optimized waste composition) and its fitness
    """
    toolbox = setup_genetic_algorithm(len(waste_types))
    
    # Initialize population
    pop = toolbox.population(n=POPULATION_SIZE)
    
    # Evaluate the entire population
    fitnesses = list(map(toolbox.evaluate, pop))
    for ind, fit in zip(pop, fitnesses):
        ind.fitness.values = fit
    
    # Begin the evolution
    for g in range(GENERATIONS):
        offspring = algorithms.varAnd(pop, toolbox, cxpb=CROSSOVER_PROB, mutpb=MUTATION_PROB)
        
        # Evaluate the individuals with an invalid fitness
        invalid_ind = [ind for ind in offspring if not ind.fitness.valid]
        fitnesses = map(toolbox.evaluate, invalid_ind)
        for ind, fit in zip(invalid_ind, fitnesses):
            ind.fitness.values = fit
        
        # Replace the old population
        pop[:] = tools.selBest(offspring, k=len(pop))
    
    # Return the best individual
    best_ind = tools.selBest(pop, 1)[0]
    return best_ind, best_ind.fitness.values[0]