"use server";

import prisma from "@/db";
import { hash } from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { signUpSchema } from "@/app/utils/schema";
import { signInSchema } from "@/app/utils/schema";

export async function signup(name: string, email: string, password: string) {
  try {
    //Find if user already exists
    if(!signUpSchema.safeParse({name, email, password}).success){
      return false
    }
    const isExistingUser = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (isExistingUser) {
      return false;
    }

    //Create a new user
    const hashedPassword = await hash(password, 10);
    await prisma.user.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });
    return true;
  } catch (e) {
    console.error(e)
    return false;
  }
}

export async function addProject(name: string, description: string) {
  const session = await getServerSession(authOptions);
  try {
    const res = await prisma.projects.create({
      data: {
        name: name,
        Description: description,
        author: { connect: { id: parseInt(session?.user.id) } },
      },
    });
    return true
  } catch (e) {
    console.error(e)
    return false;
  }
}

export async function getProjects() {
  const session = await getServerSession(authOptions);
  try {
    const allProjects = await prisma.projects.findMany({
      where: {
        authorId: parseInt(session?.user.id),
      },
    });
    return allProjects;
  } catch (e) {
    console.error(e)
    return null
  }
}

export async function getProjectCharts(id: string) {
  try {
    const allCharts = await prisma.charts.findMany({
      where: {
        projectId: id,
      },
    });
    return allCharts;
  } catch (e) {
    console.error(e)
    return null
  }
}

export async function getProjectDetails(id: string) {
  try {
    const name = await prisma.projects.findUnique({
      where:{
        id: id
      }
    })
    return name;
  } catch (e) {
    console.error(e)
    return null
  }
}

export async function deleteProject(id: string) {
  try{
    //Delete all related charts first
    await prisma.charts.deleteMany({
      where: {
        projectId: id
      }
    })
    //Delete the project
    await prisma.projects.delete({
      where: {
        id: id
      }
    })
    return true
  }
  catch(e){
    console.error(e)
    return false
  }
}

export async function addChart(project_id: string, type: string, col: number){
  try{
    const newChart = await prisma.charts.create({
      data:{
        type: type,
        column: col,
        project: { connect :{ id:project_id }}
      }
    })
    return true;
  }
  catch(e){
    console.error(e)
    return false
  }
}

export async function deleteChart(id: string){
  try{
    await prisma.charts.delete({
      where:{
        id: id
      }
    })
    return true;
  }
  catch(e){
    console.error(e)
    return false
  }
}

export async function getAllCharts(project_id: string){
  try{
    const allCharts = await prisma.charts.findMany({
      where:{
        projectId: project_id
      }
    })
    return allCharts
  }
  catch(e){
    return null
  }
}

export async function updateCsvLink(id: string, link: string){
  try{
    const svg = prisma.projects.update({
      where:{
        id: id
      },
      data:{
        csv: link
      }
    })
    return svg
  }
  catch(e){
    console.error(e)
    return null
  }
}
